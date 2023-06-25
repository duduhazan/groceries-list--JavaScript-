import { connectDB } from "./connect-to-db";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { productsRouter } from "./routes/products.route";
import { UserRouter } from "./routes/users.route";
import { ImageStorage } from "./image-storage";
import { authMiddleWare } from "./middlewares/auth.middleware";

async function startServer() {
  await connectDB("mongodb://localhost:27017/supermarket");

  const port = 3500;
  const app = express();

  const imageStorage = new ImageStorage("./key.json", "shopping-cart-images");
  const secret = "asdf!!!!"

  app.use(cors({ origin: "http://localhost:5173", credentials: true }));

  app.use(express.json());

  app.use(cookieParser());

  app.use(authMiddleWare(secret))

  app.use(UserRouter(secret));

  app.use(productsRouter(imageStorage));

  app.listen(3500, () => {
    console.log(`started server on port ${port}`);
  });
}

startServer();
