import express from "express";
import cors from "cors";
import "dotenv/config";

export const app = express();

const corsOptions = {
  origin: "http://localhost:5175",
  methods: ["GET", "POST", "PUT", "DELETE"],
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