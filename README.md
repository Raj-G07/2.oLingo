# LinguaSync (Lingua2.0)

LinguaSync is a real-time localization and synchronization platform designed for modern web applications. It consists of a Next.js client and a TypeScript-based backend server, both integrated with `lingo.dev` for seamless internationalization.

## Project Structure

- **`linguasync-client/`**: A Next.js application providing the user interface, utilizing Tailwind CSS, Framer Motion, and Radix UI components.
- **`linguasync-server/`**: A TypeScript Express server with WebSocket support for real-time synchronization.

## Tech Stack

### Client
- **Framework**: [Next.js](https://nextjs.org/) (v14)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Localization**: [@lingo.dev/sdk](https://lingo.dev/)

### Server
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Real-time**: [ws (WebSockets)](https://github.com/websockets/ws)
- **Localization**: [lingo.dev](https://lingo.dev/)

## Demo Video
- [LinguaSync Demo Video](https://youtu.be/ilpfp7JEXdk?si=uMa1lzotRwKt_T4r)
  
## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1. Install dependencies for both client and server:
   ```bash
   cd linguasync-client && npm install
   cd ../linguasync-server && npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env` in both `linguasync-client/` and `linguasync-server/`.
   - Update the variables (API keys, ports, etc.) as needed.

### Running the Application

#### Development Mode

- **Start Client**:
  ```bash
  cd linguasync-client
  npm run dev
  ```

- **Start Server**:
  ```bash
  cd linguasync-server
  npm run dev
  ```

#### Production Build

- **Build Client**:
  ```bash
  cd linguasync-client
  npm run build
  npm run start
  ```

- **Build Server**:
  ```bash
  cd linguasync-server
  npm run build
  npm run start
  ```

## Localization

This project uses `lingo.dev` for internationalization.
- Run `npm run lint` in the client directory to check and extract translations.
- The server uses the `lingo.dev` package for backend localization tasks.
