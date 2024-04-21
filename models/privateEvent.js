const mongoose = require("mongoose");

const privateEventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  location: {
    area: { type: String, required: true },
    landmark: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  hostedby: {
    type: String,
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
  },
  mobileNumbers: [String], 
});

privateEventSchema.index({ to: 1 }, { expireAfterSeconds: 0 });

const privateEvent = mongoose.model("privateEvent", privateEventSchema);

module.exports = privateEvent;
