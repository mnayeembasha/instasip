import serverless from "serverless-http";
import app from "./index";  

export const handler = serverless(app);
export const lambdaHandler = async (event: any, context: any) => {
  try {
    return await handler(event, context);
  } catch (err) {
    console.error("Lambda caught error:", err);
    throw err;
  }
};
