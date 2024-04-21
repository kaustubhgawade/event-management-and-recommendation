const mongoose = require("mongoose");
require('dotenv').config();


async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("Connected to database successfully");
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { connectToDatabase };
