import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  id: String,
  clientName: String,
  clientNumber: Number,
  clientEmail: String,
});

export default mongoose.model("Client", clientSchema);
