import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectToDatabase } from "../config/db";
import { initShutdown } from "./shutdown";

const PORT = Number(process.env.PORT) || 5001;

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });
});

const startServer = async (): Promise<void> => {
  try {
    await connectToDatabase();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    initShutdown(server);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

void startServer();
