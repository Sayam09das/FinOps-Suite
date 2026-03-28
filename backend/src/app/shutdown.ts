import { Server } from "http";
import { disconnectFromDatabase } from "../config/db";

let server: Server | null = null;

export const initShutdown = (httpServer: Server) => {
  server = httpServer;

  const gracefulShutdown = async (signal: string) => {
    console.log(`Received ${signal}, starting graceful shutdown...`);

    // Allow 10s for pending requests
    const timeout = setTimeout(() => {
      console.error("Force closing after timeout");
      process.exit(1);
    }, 10000);

    try {
      if (server) {
        await new Promise<void>((resolve, reject) => {
          server?.close((error) => {
            if (error) {
              reject(error);
              return;
            }

            resolve();
          });
        });

        console.log("HTTP server closed");
      }

      await disconnectFromDatabase();
      console.log("Prisma disconnected");

      clearTimeout(timeout);
      process.exit(0);
    } catch (error) {
      console.error("Shutdown error:", error);
      clearTimeout(timeout);
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => void gracefulShutdown("SIGINT"));
};
