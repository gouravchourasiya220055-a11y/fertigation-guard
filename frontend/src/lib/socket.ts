import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 'https://fertigation-backend-gourav.onrender.com';

export const socket: Socket = io(URL, {
  autoConnect: false, // Connect manually, e.g., after login
});
