import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

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

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveSensorData, setLiveSensorData] = useState<any | null>(null);
  const [liveRelayData, setLiveRelayData] = useState<any | null>(null);

  useEffect(() => {
    // Assuming backend runs on the same host but port 5000 in dev
    // In production, it might just be the same origin or read from env.
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    
    const newSocket = io(backendUrl, {
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setIsConnected(false);
    });

    newSocket.on('sensor_update', (data) => {
      setLiveSensorData(data);
    });

    newSocket.on('relay_update', (data) => {
      setLiveRelayData(data);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, liveSensorData, liveRelayData }}>
      {children}
    </SocketContext.Provider>
  );
};
