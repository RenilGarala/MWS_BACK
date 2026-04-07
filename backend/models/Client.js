const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  id: String,
  clientName: String,
  clientNumber: Number,
  clientEmail: String,
});

module.exports = mongoose.model('Client', clientSchema);
