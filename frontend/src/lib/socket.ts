import { io } from "socket.io-client";

const URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "https://fertigation-backend-gourav.onrender.com";

export const socket = io(URL, {
  transports: ["websocket", "polling"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
});

socket.on("connect", () => {
  console.log("Socket Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket Disconnected:", reason);
});