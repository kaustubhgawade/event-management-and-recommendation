const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  img: {
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
  },
  location: {
    area: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  hostedby: {
    type: String,
    required: true,
  },
  category: {
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
  tickets: {
    type: Number,
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
});

eventSchema.index({ to: 1 }, { expireAfterSeconds: 0 });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
