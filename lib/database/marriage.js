const mongoose = require('mongoose');

const marriageSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // User ID
  waifu: { type: String, required: true }    // Waifu name (e.g., "Asuna")
});

const Marriage = mongoose.model('Marriage', marriageSchema);

module.exports = Marriage;
