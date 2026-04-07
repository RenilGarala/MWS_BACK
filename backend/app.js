import express from "express";
import cors from "cors";
import "dotenv/config";

export const app = express();

app.use(cors());

app.use(express.json());
import projectRoutes from "./routes/projectRoutes.js";

app.use("/api/v1", projectRoutes);

//global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});
