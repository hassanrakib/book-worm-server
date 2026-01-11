import mongoose from "mongoose";
import config from "../config";
import { User } from "../modules/user/user.model";

async function createAdmin() {
  try {
    // connect to mongodb
    const dbUser = config.db_user;
    const dbPass = config.db_password;
    if (!dbUser || !dbPass) {
      throw new Error("Missing DB_USER or DB_PASSWORD in environment (.env)");
    }

    console.log("Connecting to mongodb...");

    const dbConnectionUri = `mongodb+srv://${encodeURIComponent(
      dbUser
    )}:${encodeURIComponent(
      dbPass
    )}@cluster0.4d9zwtq.mongodb.net/?appName=Cluster0`;
    await mongoose.connect(dbConnectionUri, { dbName: "book-worm" });

    console.log("Searching for existing admin...");

    //   check admin existence
    const exists = await User.findOne({ role: "admin" });
    if (exists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    await User.create({
      name: "Admin",
      profilePhoto: "https://res.cloudinary.com/dxpichk0o/image/upload/v1754230894/empty_state_no_image_qgfzfv.png",
      email: config.admin_email,
      password: config.admin_password,
      role: "admin",
    });

    console.log("✅ Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
}

createAdmin();
