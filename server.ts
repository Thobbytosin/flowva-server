// import "reflect-metadata";
import http from "http";
import { app } from "./app";
import dotenv from "dotenv";
import connectToDB from "./config/database";

// create server
const server = http.createServer(app);

// load environment variables
dotenv.config();

// run server
server.listen(process.env.PORT, () => {
  console.log("SERVER IS RUNNING ON PORT " + process.env.PORT);
  //   connect to database
  connectToDB();
});
