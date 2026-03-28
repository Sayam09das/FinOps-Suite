import app from "./app";
import { connectToDatabase } from "../config/db";
import { initShutdown } from "./shutdown";

const PORT = Number(process.env.PORT) || 5001;

const startServer = async (): Promise<void> => {
  try {
    await connectToDatabase();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    initShutdown(server);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

void startServer();
