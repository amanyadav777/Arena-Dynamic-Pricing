import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from './utils/ApiError.js';
const globalErrorHandler = (err, req, res, next) => {
  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      stack: err.stack? err.stack : undefined,
    });
  }

  // Default to 500 Internal Server Error for unknown errors
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    stack: err.stack ? err.stack : undefined,
  });
};


const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());



//routes import
import arenaRouter from './routes/arena.routes.js'
import dynamicPricingRouter from './routes/dynamicPricing.routes.js'


//routes declaration
app.use("/api/v1/arena", arenaRouter)
app.use("/api/v1/dynamic-pricing", dynamicPricingRouter);
app.use(globalErrorHandler);

export { app };
