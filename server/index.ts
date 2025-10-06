import express from "express";
import { PORT, NODE_ENV } from "./config"; // Ensure NODE_ENV is defined
import cors from "cors";
import { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import path from "path";

const __dirname = path.resolve();
const app = express();

// ✅ Dynamic CORS based on environment
const allowedOrigin =
  NODE_ENV === "development"
    ? "http://localhost:5173"
    : "https://instasip.vercel.app";

app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json({ limit: '7mb' }));
app.use(express.urlencoded({ extended: true, limit: '7mb' }));
app.use(cookieParser());

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ❌ Frontend serving logic commented out
// if (NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "../client/dist")));
//     app.get("*", (req: Request, res: Response) => {
//         res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
//     });
// }

// Error handling
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Page Not Found" });
});

// Start server & connect DB
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});
