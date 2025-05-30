import { io } from 'socket.io-client';

// Create a single socket instance that will be shared across the app
export const socket = io('https://www.skymatch.us');
// export const socket = io('http://localhost:3000');

// Add listeners for connection status
socket.on('connect', () => {
  console.log('Connected to server with socket:', socket.id);
});

socket.on('error', (err: any) => {
  console.error('Socket error:', err);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});
