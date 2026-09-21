import { Server } from "http";
import app from "./app";
import config from "./config";
import { connectToDatabase, client } from "./config/db";
import { initUserIndexes } from "./app/modules/user/user.model";

let server: Server;

async function bootstrap() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await connectToDatabase();

    // Initialize database indexes (e.g., unique email)
    await initUserIndexes();

    server = app.listen(config.port, () => {
      console.log(`========================================`);
      console.log(`🚀 DevShare Server is running on port ${config.port}`);
      console.log(`🌐 Base URL: http://localhost:${config.port}`);
      console.log(`🧪 Environment: ${config.env}`);
      console.log(`========================================`);
    });
  } catch (error: any) {
    if (error?.code === 8000 || error?.errmsg?.includes("authentication failed")) {
      console.error(
        "\n❌ MongoDB Atlas Authentication Failed!\n" +
        "Please check your MongoDB Atlas Database Access tab:\n" +
        "1. Ensure the user 'devshare' exists in MongoDB Atlas -> Security -> Database Access.\n" +
        "2. Ensure the password in 'devshare-server/.env.local' matches that user's password.\n" +
        "3. Ensure the user has 'Read and write to any database' or 'readWrite' privileges.\n"
      );
    } else {
      console.error("Failed to start server:", error);
    }
    process.exit(1);
  }

  // Graceful shutdown handling
  const exitHandler = async () => {
    if (server) {
      server.close(async () => {
        console.log("HTTP Server closed.");
        await client.close();
        console.log("MongoDB connection closed.");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on("SIGTERM", exitHandler);
  process.on("SIGINT", exitHandler);

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    exitHandler();
  });
}

bootstrap();
