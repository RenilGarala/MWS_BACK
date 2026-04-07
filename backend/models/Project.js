import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectId: String,
  projectName: String,
  numberOfItems: Number, // Initially specified expected parts count
  description: String,
  totalItems: Number, // Current total items quantity sum
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  status: { type: String, enum: ["current", "completed"], default: "current" },
});

export default mongoose.model("Project", projectSchema);
