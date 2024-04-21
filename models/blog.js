const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  blogBody: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
