import serverless from "serverless-http";
import app from "./index";  
import {connectRedis} from "./lib/redisClient";
import { connectDB } from "./lib/db";

export const handler = serverless(app);
export const lambdaHandler = async (event: any, context: any) => {
  try {
    await connectRedis();
    await connectDB();
    return await handler(event, context);
  } catch (err) {
    console.error("Lambda caught error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
