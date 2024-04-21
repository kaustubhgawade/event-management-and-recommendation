const mongoose = require("mongoose");

const organiserSchema = new mongoose.Schema({
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
  city: {
    type: String,
    required: true,
  },
  birthdate: {
    date: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
  },
  buisnessname: {
    type: String,
    required: true,
  },
  buisnessdetails: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

const Organiser = mongoose.model("Organiser", organiserSchema);

module.exports = Organiser;
