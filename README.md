# SkyMatch Trip Planner

A group trip planning app that helps friends decide on their next destination through a fun, interactive voting process.

## Setup and Running

### 1. Start the WebSocket Server

```bash
cd server
npm install
npm start
```

The WebSocket server will start on port 8080 (or the port specified in your .env file).

### 2. Start the Expo App

```bash
cd app
npm install
expo start
```

This will start the Expo development server. You can then:

- Press 'a' to open Android emulator
- Press 'i' to open iOS simulator
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
/trip-planner
├── /app            # Expo + React Native + TypeScript + Zustand
│   ├── /app       # Screens and navigation
│   ├── /hooks     # Custom React hooks
│   ├── /state     # Zustand state management
│   └── /components # Reusable UI components
└── /server        # Node.js + WebSocket server
```

## Game Flow

1. Host creates a new lobby and gets a unique code
2. Friends join using the lobby code
3. Game progresses through phases:
   - Personal questions (budget, preferences)
   - Tinder-style A vs B voting
   - Final results with trip recommendations

## Development

- WebSocket server: Edit `/server/server.js`
- Client state: Edit `/app/src/state/stores/lobbyState`
- Game screens: Edit files in `/app/app/(game)/`
