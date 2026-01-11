import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";
import { Server } from "http";

let server: Server;

async function main() {
  try {
    // connect to mongodb

    const dbUser = config.db_user;
    const dbPass = config.db_password;
    if (!dbUser || !dbPass) {
      throw new Error("Missing DB_USER or DB_PASSWORD in environment (.env)");
    }

    const dbConnectionUri = `mongodb+srv://${encodeURIComponent(
      dbUser
    )}:${encodeURIComponent(
      dbPass
    )}@cluster0.4d9zwtq.mongodb.net/?appName=Cluster0`;
    await mongoose.connect(dbConnectionUri, { dbName: "techomarko" });

    // create server
    server = app.listen(config.port, () => {
      console.log(`# Server is running in port ${config.port!}`);
    });
  } catch (err) {
    // error when connecting to mongodb
    console.log(err);
  }
}

// log unhandled promise rejection error & close the server
process.on("unhandledRejection", (error, promise) => {
  console.log({ error, promise });

  // graceful shutdown that lets existing connections to finish
  server.close(() => process.exit(1));
});

// handle synchronous code error
process.on("uncaughtException", (error) => {
  console.log({ error });

  // shutdown immediately
  process.exit(1);
});

void main();
