// pnnzPUuLmyPJ4Fvx
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DB_URI || "";

const connectToDB = async () => {
  try {
    await mongoose.connect(dbUrl).then((data) => {
      console.log("DATABASE CONNECTED SUCCESSFULLY TO:" + data.connection.host);
    });
  } catch (error) {
    console.log("DATABASE CONNECTION ERROR:", error);
    setTimeout(connectToDB, 5000); // reconnect to database after 5 seconds incase of an error
  }
};

export default connectToDB;
