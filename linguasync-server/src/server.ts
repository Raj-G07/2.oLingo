import dotenv from "dotenv";
import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { LingoMCP } from "./mcp-client";

dotenv.config({ path: "../.env" });

/* -------------------------------------------------------------------------- */
/*                               Type Definitions                              */
/* -------------------------------------------------------------------------- */

type LangCode = string;

interface InitMessage {
  type: "INIT";
  socketId: string;
}

interface JoinMessage {
  type: "join";
  lang: LangCode;
}

interface ChatMessage {
  type: "chat";
  content: string;
}

interface DocEditPayload {
  content: string;
  docId: string;
}

interface DocEditMessage {
  type: "doc_edit";
  content: string; // JSON stringified DocEditPayload
}

type IncomingMessage = JoinMessage | ChatMessage | DocEditMessage;

interface OutgoingMessage {
  type: "msg";
  id: string;
  sender: string;
  content: string;
  targetLang: LangCode;
  sourceLang: LangCode;
}

/* -------------------------------------------------------------------------- */
/*                               App Bootstrap                                 */
/* -------------------------------------------------------------------------- */

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// MCP Client (strict startup dependency)
const mcp = new LingoMCP();

// In-memory state (replace with Redis in prod)
const sockets = new Map<string, WebSocket>();
const userLangs = new Map<string, LangCode>();

/* -------------------------------------------------------------------------- */
/*                              Server Startup                                 */
/* -------------------------------------------------------------------------- */

async function startServer(): Promise<void> {
  try {
    await mcp.connect(); // 🚨 hard dependency

    const PORT = Number(process.env.PORT) || 3001;
    server.listen(PORT, () => {
      console.log(`[Server] Listening on port ${PORT}`);
      console.log(`[Server] Lingo.dev MCP: ACTIVE`);
    });
  } catch (error) {
    console.error("[CRITICAL STARTUP FAILURE]");
    console.error(error);
    process.exit(1);
  }
}

/* -------------------------------------------------------------------------- */
/*                              WebSocket Logic                                */
/* -------------------------------------------------------------------------- */

wss.on("connection", (ws: WebSocket) => {
  const socketId = `sock_${Math.random().toString(36).slice(2, 11)}`;

  sockets.set(socketId, ws);

  console.log(`[WS] Client connected: ${socketId}`);

  const initPayload: InitMessage = {
    type: "INIT",
    socketId,
  };

  ws.send(JSON.stringify(initPayload));
  ws.send(JSON.stringify({ type: "MCP_READY" }));

  ws.on("message", async (rawData: WebSocket.RawData) => {
    try {
      const msg = JSON.parse(rawData.toString()) as IncomingMessage;

      console.log(`[WS] ${socketId} → ${msg.type}`);

      /* ----------------------------- JOIN ----------------------------- */
      if (msg.type === "join") {
        userLangs.set(socketId, msg.lang);

        ws.send(
          JSON.stringify({
            type: "JOIN_CONFIRMED",
            lang: msg.lang,
          })
        );

        return;
      }

      /* --------------------------- DOC EDIT ---------------------------- */
      if (msg.type === "doc_edit") {
        const sourceLang = userLangs.get(socketId) ?? "en-US";
        const parsed = JSON.parse(msg.content) as DocEditPayload;

        for (const [targetId, targetWs] of sockets.entries()) {
          if (targetWs.readyState !== WebSocket.OPEN) continue;

          const targetLang = userLangs.get(targetId) ?? "en-US";

          const translations = await mcp.routeText(
            parsed.content,
            sourceLang,
            [targetLang]
          );

          const outgoing: OutgoingMessage = {
            type: "msg",
            id: `doc_${Date.now()}_${targetId}`,
            sender: socketId,
            content: translations[targetLang] ?? parsed.content,
            sourceLang,
            targetLang,
          };

          targetWs.send(JSON.stringify(outgoing));
        }

        return;
      }

      /* ------------------------------ CHAT ----------------------------- */
      if (msg.type === "chat") {
        const sourceLang = userLangs.get(socketId) ?? "en-US";

        for (const [targetId, targetWs] of sockets.entries()) {
          if (targetWs.readyState !== WebSocket.OPEN) continue;

          const targetLang = userLangs.get(targetId) ?? "en-US";

          const translations = await mcp.routeText(
            msg.content,
            sourceLang,
            [targetLang]
          );

          const outgoing: OutgoingMessage = {
            type: "msg",
            id: `msg_${Date.now()}_${targetId}`,
            sender: socketId,
            content: translations[targetLang] ?? msg.content,
            sourceLang,
            targetLang,
          };

          targetWs.send(JSON.stringify(outgoing));
        }
      }
    } catch (err) {
      console.error(`[WS] Message error (${socketId})`, err);
    }
  });

  ws.on("close", () => {
    sockets.delete(socketId);
    userLangs.delete(socketId);
    console.log(`[WS] Client disconnected: ${socketId}`);
  });

  ws.on("error", (err: Error) => {
    console.error(`[WS] Error (${socketId})`, err);
  });
});

/* -------------------------------------------------------------------------- */
/*                                  Start                                     */
/* -------------------------------------------------------------------------- */

startServer();
