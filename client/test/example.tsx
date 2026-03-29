"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export default function SocketTest() {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("alert", (data) => {
      console.log("🔔 ALERT:", data);

      // Show toast / notification
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Socket.io Test</h1>
      <p>Check console for alerts when creating transactions near/exceeding budget.</p>
    </div>
  );
}
