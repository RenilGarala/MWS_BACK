import express from "express";
import cors from "cors";
import "dotenv/config";

export const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    // Allow any localhost origin (like 5173, 5174, 5175, etc.) or no origin
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS policy'))
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
};

app.use(cors(corsOptions)); // ✅ enough

app.use(express.json());

import projectRoutes from "./routes/projectRoutes.js";
app.use("/api/v1/project", projectRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});