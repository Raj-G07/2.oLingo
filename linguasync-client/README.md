# LinguaSync Client

The frontend application for LinguaSync, built with Next.js and integrated with `lingo.dev` for real-time localization.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v14)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) / [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Localization**: [@lingo.dev/sdk](https://lingo.dev/)

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint and checks for translation extractions via `lingo.dev`.

## Configuration

Environment variables can be managed via the `.env` file. Ensure you have the necessary `LINGO_` variables if using the localization SDK.

## Project Structure

- `src/`: Core application logic and pages.
- `components/`: Reusable UI components.
- `packages/`: Local internal packages (e.g., `lingo-dev-sdk`).
- `public/`: Static assets.
