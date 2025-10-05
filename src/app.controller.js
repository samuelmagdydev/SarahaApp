import path from "node:path";
import * as dotenv from "dotenv";
// dotenv.config({ path: path.join("./src/config/.env.dev") });
dotenv.config({})
import express from "express";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import messageController from "./modules/message/message.controller.js";
import connectDB from "./DB/connection.db.js";
import { globalErrorHandling } from "./utils/response.js";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const bootstrap = async () => {
  const app = express();
  const port = process.env.PORT || 5000;
  app.use(cors());
  app.use(morgan("dev"));
  app.use(helmet());

  const limter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 5, // limit each IP to 100 requests per windowMs
    message: "Too many requests , please try again later 🤦‍♂️😒 ",
    // legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
  app.use("/auth", limter);

  //DB
  await connectDB();

  app.use("/uploads", express.static(path.resolve("./src/uploads")));

  app.use(express.json());

  app.get("/", (req, res) => res.send("Hello World"));
  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/message", messageController);

  app.all("{/*dummy}", (req, res) =>
    res.status(404).json({ message: "In-valid app Routing" })
  );

  app.use(globalErrorHandling);
  app.listen(port, () => console.log(`Saraha App listening on port ${port}!`));
};

export default bootstrap;
