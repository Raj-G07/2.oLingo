# LinguaSync Server

The backend server for LinguaSync, providing real-time synchronization and localization support through Express and WebSockets.

## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Real-time**: [ws](https://github.com/websockets/ws)
- **Localization**: [lingo.dev](https://lingo.dev/)

## Available Scripts

- `npm run dev`: Starts the server in development mode using `ts-node`.
- `npm run build`: Compiles the TypeScript code to JavaScript in the `dist/` directory.
- `npm run start`: Starts the compiled production server.

## Features

- **Express API**: RESTful endpoints for application data.
- **WebSocket Gateway**: Real-time broadcasting of events and state updates.
- **Localization Support**: Integration with `lingo.dev` for server-side internationalization.

## Configuration

Create a `.env` file based on `.example.env` to configure your environment variables (PORT, API keys, etc.).
