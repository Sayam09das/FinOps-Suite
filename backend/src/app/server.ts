import app from "./app";
import cookieParser from 'cookie-parser';

app.use(cookieParser());
import { createServer } from "http";
import { Server } from "socket.io";
import { connectToDatabase } from "../config/db";
import { initShutdown } from "./shutdown";

const PORT = Number(process.env.PORT) || 5001;

const server = createServer(app);

const allowedOrigins = (
  process.env.FRONTEND_URLS ??
  process.env.FRONTEND_URL ??
  'http://localhost:3000,http://localhost:3001,https://finops-suite.vercel.app,https://fin-ops-suite.vercel.app'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Socket.io CORS - must match backend CORS
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true, // CRITICAL: Allow cookies with socket connections
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
