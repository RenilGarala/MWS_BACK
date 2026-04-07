const mongoose = require('mongoose');

const subItemSchema = new mongoose.Schema({
  numberOfPart: Number,
  partCode: String,
  partName: String,
  orderQuantity: Number, // Adding Order Quantity here based on requirements
  dispatchDate: String, // Or Date
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
});

module.exports = mongoose.model('SubItem', subItemSchema);
