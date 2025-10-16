import express from "express";
import { PORT, NODE_ENV } from "./config";
import serverless from "serverless-http";
import cors from "cors";
import { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import cartRoutes from "./routes/cart.routes";
import paymentRoutes from "./routes/payment.routes";
import path from "path";
import {connectDB} from "./lib/db";
import {connectRedis} from "./lib/redisClient"

const app = express();

app.use(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' })
);

const allowedOrigins = NODE_ENV === "development"
  ? ["http://localhost:5173"]
  : ["https://instasip.in", "https://www.instasip.in"];

// Custom CORS middleware to handle multiple origins and credentials
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With");
    res.header("Access-Control-Expose-Headers", "Set-Cookie,Authorization");
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") return res.sendStatus(204);

  next();
});

app.use(express.json({ limit: '7mb' }));
app.use(express.urlencoded({ extended: true, limit: '7mb' }));
app.use(cookieParser());

const stagePrefix = '/prod'; // can also use process.env.API_STAGE
const routerPrefix = `${stagePrefix}/api`;

app.get(`${routerPrefix}/health`, (req: Request, res: Response) => {
    res.status(200).json({ status: "OK", message: "Hello from Instasip Backend API!" });
});

// Use the same prefix for other routes
app.use(`${routerPrefix}/auth`, authRoutes);
app.use(`${routerPrefix}/products`, productRoutes);
app.use(`${routerPrefix}/cart`, cartRoutes);
app.use(`${routerPrefix}/orders`, orderRoutes);
app.use(`${routerPrefix}/payment`, paymentRoutes);

app.use((err: any, req: Request, res: Response, next: any) => {
    console.error("Unhandled error:", err);
    console.log("Incoming request:", req.method, req.path);
    res.status(500).json({ message: "Internal Server Error" });
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Page Not Found" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectRedis();
    connectDB();
});
//connectRedis();
// connectDB();
export default app;

// if (process.env.NODE_DEPLOY !== "lambda") {
//   const PORT = process.env.PORT;
//   import("./lib/db").then(({ connectDB }) => {
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//       connectDB();
//     });
//   });
// }
