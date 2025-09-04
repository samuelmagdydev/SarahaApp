import path from "node:path";
import * as dotenv from "dotenv";
dotenv.config({path:path.join('./src/config/.env.dev')});

import express from "express";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js"
import connectDB from "./DB/connection.db.js";
import { globalErrorHandling } from "./utils/response.js";
import cors from 'cors'

const bootstrap = async () => {
  const app = express();
  const port = process.env.PORT || 5000;
  app.use(cors())
  //DB
  await connectDB()
  
  app.use(express.json())

  app.get("/", (req, res) => res.send("Hello World"));
  app.use("/auth", authController);
  app.use("/user",userController);
  app.all('{/*dummy}',(req,res)=> res.status(404).json({message:"In-valid app Routing"}))



  app.use(globalErrorHandling)
  app.listen(port, () => console.log(`Saraha App listening on port ${port}!`));
}

export default bootstrap
