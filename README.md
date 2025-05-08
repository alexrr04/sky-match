# SkyMatch

[Logo placeholder]

[Screenshots placeholder]

[Demo video placeholder]

## About SkyMatch

SkyMatch is a collaborative travel planning app developed during HackUPC 2025. The app revolutionizes group trip planning by turning it into an engaging, real time game where friends collectively decide on their ideal vacation destination.

## Key Features

- **Instant Group Creation**: Create a lobby and invite friends using a unique code
- **Interactive Decision Making**: Swipe through travel preferences in a fun, Tinder-like interface
- **Two-Phase Planning**:
  - Personal Questions: Individual preferences, budget, travel restrictions
  - Group Preferences: Vote on travel styles (Beach vs Mountain, Adventure vs Relaxation, etc.)
- **Real-time Synchronization**: All participants see results instantly as votes come in
- **Smart Destination Matching**: Uses Amadeus API and an AI-generated dataset to suggest the perfect destinations based on group preferences

## Tech Stack

- **Frontend**:
  - React Native with Expo
  - TypeScript for type safety
  - Zustand for state management
- **Backend**:
  - Node.js server
  - Amadeus API integration
  - Socket.IO for real-time communication

## Project Structure

```
.
├── client/               # Mobile app (Expo/React Native)
│   ├── app/             # Application screens
│   ├── components/      # Reusable UI components
│   ├── state/          # Zustand store and state management
│   ├── constants/      # App-wide constants and types
│   └── utils/          # Utility functions
|   └── ...
│
└── server/              # Backend server (Node.js)
    └── server.js        # Main server file
    └── ...
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- Expo CLI
- Android emulator or physical device for testing

### Installation

1. Clone the repository:

```bash
git clone https://github.com/alexrr04/sky-match
cd sky-match
```

2. Install client dependencies:

```bash
cd client
npm install
```

3. Download the last release of Sky Match from the repo and install it on your mobile device or emulator:

   - [SkyMatch APK](https://github.com/alexrr04/sky-match/releases/tag/v0.1.0-dev)

4. Start the client:

```bash
npx expo start
```

5. Scan the QR code in the development server mode using your mobile device or emulator to open the app.

6. Enjoy the app!

### Important Notes

- The server is hosted externally, so you don't need to run it locally
- If you want to run the server locally for development:
  1. Change the server address in `client/utils/socket.ts` to `localhost`
  2. Run the server:
  ```bash
  cd server
  npm install
  node server.js
  ```

## Contributing

This project was created during HackUPC 2425. Feel free to submit issues and enhancement requests.

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file included in the repository.
