import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  liveSensorData: any | null;
  liveRelayData: any | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  liveSensorData: null,
  liveRelayData: null,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveSensorData, setLiveSensorData] = useState<any>(null);
  const [liveRelayData, setLiveRelayData] = useState<any>(null);

  useEffect(() => {
    const backendUrl =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "https://fertigation-backend-gourav.onrender.com";

    const newSocket = io(backendUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket Connected");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket Disconnected");
      setIsConnected(false);
    });

    // LIVE TELEMETRY FROM BACKEND
    newSocket.on("telemetry", (data) => {
      console.log("📡 LIVE TELEMETRY:", data);

      setLiveSensorData({
        soilMoisture: data.soilMoisture,
        ph: data.ph,
        ec: data.tds,
        tds: data.tds,
        temperature: data.temperature,
        humidity: data.humidity,
        rssi: data.rssi ?? -70,
      });

      setLiveRelayData({
        relay1: data.relay1,
        relay2: data.relay2,
        relay3: data.relay3,
        relay4: data.relay4,
        relay5: data.relay5,
        relay6: data.relay6,
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        liveSensorData,
        liveRelayData,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;