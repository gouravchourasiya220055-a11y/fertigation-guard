import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  liveSensorData: any | null;
  liveRelayData: any | null;
  liveDeviceStatus: any | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  liveSensorData: null,
  liveRelayData: null,
  liveDeviceStatus: null,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveSensorData, setLiveSensorData] = useState<any>(null);
  const [liveRelayData, setLiveRelayData] = useState<any>(null);
  const [liveDeviceStatus, setLiveDeviceStatus] = useState<any>(null);

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
      toast.success("Connected to Gateway");
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket Disconnected");
      setIsConnected(false);
      toast.error("Disconnected from Gateway");
    });

    // LIVE TELEMETRY FROM BACKEND
    newSocket.on("telemetry", (data) => {
      setLiveSensorData({
        soilMoisture: data.soilMoisture,
        ph: data.ph,
        ec: data.tds,
        tds: data.tds,
        temperature: data.temperature,
        humidity: data.humidity,
        rssi: data.rssi,
        snr: data.snr,
        battery: data.battery,
        systemState: data.systemState,
        firmwareVersion: data.firmwareVersion,
        
        // Flow Metrics
        flowMixed: data.flowMixed,
        flowWater: data.flowWater,
        flowFertilizer: data.flowFertilizer,
        waterUsed: data.waterUsed,
        fertilizerUsed: data.fertilizerUsed,
        mixedDelivered: data.mixedDelivered,
        
        timestamp: data.timestamp
      });

      // Update relay from telemetry payload as fallback
      setLiveRelayData((prev: any) => {
        const newRelays = {
          waterPump: data.relay1,
          peristalticPump: data.relay2,
          highPressurePump: data.relay3,
          stirrer: data.relay4,
          flushValve: data.relay5,
          relay6: data.relay6,
        };
        
        // Check for specific critical events to toast (only if prev existed)
        if (prev) {
          if (newRelays.highPressurePump && !prev.highPressurePump) toast.success("Main Pump Started");
          if (!newRelays.highPressurePump && prev.highPressurePump) toast.success("Main Pump Stopped");
          if (newRelays.flushValve && !prev.flushValve) toast.success("Base Pump Running");
          if (newRelays.relay6 && !prev.relay6) toast.success("Drain Valve Open");
          if (!newRelays.relay6 && prev.relay6) toast.success("Drain Valve Closed");
        }
        
        return newRelays;
      });
    });

    newSocket.on("relay_update", (data) => {
      setLiveRelayData((prev: any) => {
        if (prev) {
          if (data.highPressurePump && !prev.highPressurePump) toast.success("Main Pump Started");
          if (!data.highPressurePump && prev.highPressurePump) toast.success("Main Pump Stopped");
          if (data.flushValve && !prev.flushValve) toast.success("Base Pump Running");
          if (data.relay6 && !prev.relay6) toast.success("Drain Valve Open");
          if (!data.relay6 && prev.relay6) toast.success("Drain Valve Closed");
        }
        return {
          waterPump: data.waterPump,
          peristalticPump: data.peristalticPump,
          highPressurePump: data.highPressurePump,
          stirrer: data.stirrer,
          flushValve: data.flushValve,
          relay6: data.relay6
        };
      });
    });

    const handleDeviceStatus = (data: any) => {
      setLiveDeviceStatus(data);
      if (data.status === 'offline') {
        toast.error(`Device ${data.deviceId} went offline`);
      } else if (data.status === 'online') {
        toast.success(`Device ${data.deviceId} is online`);
      }
    };

    newSocket.on("device_status", handleDeviceStatus);
    newSocket.on("heartbeat", handleDeviceStatus);

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
        liveDeviceStatus,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;