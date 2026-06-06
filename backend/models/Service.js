const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: String,
  icon: String,
});

module.exports = mongoose.model("Service", serviceSchema);
