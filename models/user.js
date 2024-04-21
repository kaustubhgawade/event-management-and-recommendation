const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobilenumber: {
    type: Number,
    required: true,
  },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
  },
  birthdate: {
    date: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
  },
  interest: {
    type: Array,
    required: true,
  },
    password: {
      type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
