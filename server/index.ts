import express from "express";
import { PORT, NODE_ENV } from "./config";
import serverless from "serverless-http";
import cors from "cors";
import { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import cartRoutes from "./routes/cart.routes";
import paymentRoutes from "./routes/payment.routes";
import path from "path";

const app = express();

app.use(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' })
);

const allowedOrigin = NODE_ENV==="development"?"http://localhost:5173":['https://instasip.in','https://www.instasip.in'];


app.use((req, res, next) => {
  // Skip CORS for webhook route since Razorpay doesn't send Origin header
  if (req.path === '/api/payment/webhook') {
    return next();
  }

  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
  })(req, res, next);
});



app.use(express.json({ limit: '7mb' }));
app.use(express.urlencoded({ extended: true, limit: '7mb' }));
app.use(cookieParser());

app.get("/api/health",(req:Request,res:Response)=>{
  res.status(200).json({status:"OK",message:"Hello from Instasip API"});
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use('/api/cart', cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);


app.use((err: any, req: Request, res: Response, next: any) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Page Not Found" });
});

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//     connectDB();
// });
connectDB();
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
