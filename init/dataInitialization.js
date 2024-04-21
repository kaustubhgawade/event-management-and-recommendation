const mongoose = require("mongoose");
const User = require("../models/User"); // Assuming your User model is defined in a file called "User.js"

// Define the user data with modified objects
const usersData = [
  {
    fullname: "Aarav Kumar",
    email: "aarav.kumar@example.com",
    mobilenumber: 9876543210,
    location: {
      city: "Bangalore",
      state: "Karnataka",
      pincode: 560001,
    },
    birthdate: {
      date: 5,
      month: 8,
      year: 1993,
    },
    interest: ["sports", "music"],
    password: "password123",
  },
  {
    fullname: "Neha Sharma",
    email: "neha.sharma@example.com",
    mobilenumber: 9876543211,
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      pincode: 400001,
    },
    birthdate: {
      date: 12,
      month: 3,
      year: 1988,
    },
    interest: ["technology", "arts"],
    password: "password456",
  },
  {
    fullname: "Riya Patel",
    email: "riya.patel@example.com",
    mobilenumber: 9876543212,
    location: {
      city: "Delhi",
      state: "Delhi",
      pincode: 110001,
    },
    birthdate: {
      date: 25,
      month: 6,
      year: 1995,
    },
    interest: ["education", "history"],
    password: "password789",
  },
  {
    fullname: "Aditya Singh",
    email: "aditya.singh@example.com",
    mobilenumber: 9876543213,
    location: {
      city: "Kolkata",
      state: "West Bengal",
      pincode: 700001,
    },
    birthdate: {
      date: 7,
      month: 10,
      year: 1990,
    },
    interest: ["music", "arts"],
    password: "passwordABC",
  },
  {
    fullname: "Priya Gupta",
    email: "priya.gupta@example.com",
    mobilenumber: 9876543214,
    location: {
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: 600001,
    },
    birthdate: {
      date: 15,
      month: 2,
      year: 1997,
    },
    interest: ["sports", "technology"],
    password: "passwordDEF",
  },
  {
    fullname: "Arjun Patel",
    email: "arjun.patel@example.com",
    mobilenumber: 9876543215,
    location: {
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: 380001,
    },
    birthdate: {
      date: 9,
      month: 11,
      year: 1985,
    },
    interest: ["arts", "history"],
    password: "passwordGHI",
  },
  {
    fullname: "Ananya Singh",
    email: "ananya.singh@example.com",
    mobilenumber: 9876543216,
    location: {
      city: "Hyderabad",
      state: "Telangana",
      pincode: 500001,
    },
    birthdate: {
      date: 20,
      month: 4,
      year: 1991,
    },
    interest: ["technology", "education"],
    password: "passwordJKL",
  },
  {
    fullname: "Aryan Sharma",
    email: "aryan.sharma@example.com",
    mobilenumber: 9876543217,
    location: {
      city: "Pune",
      state: "Maharashtra",
      pincode: 411001,
    },
    birthdate: {
      date: 3,
      month: 8,
      year: 1989,
    },
    interest: ["sports", "music"],
    password: "passwordMNO",
  },
  {
    fullname: "Ishaan Gupta",
    email: "ishaan.gupta@example.com",
    mobilenumber: 9876543218,
    location: {
      city: "Jaipur",
      state: "Rajasthan",
      pincode: 302001,
    },
    birthdate: {
      date: 28,
      month: 10,
      year: 1994,
    },
    interest: ["technology", "arts"],
    password: "passwordPQR",
  },
  {
    fullname: "Kavya Singh",
    email: "kavya.singh@example.com",
    mobilenumber: 9876543219,
    location: {
      city: "Lucknow",
      state: "Uttar Pradesh",
      pincode: 226001,
    },
    birthdate: {
      date: 11,
      month: 1,
      year: 1996,
    },
    interest: ["music", "education"],
    password: "passwordSTU",
  },
  {
    fullname: "Vivaan Patel",
    email: "vivaan.patel@example.com",
    mobilenumber: 9876543220,
    location: {
      city: "Surat",
      state: "Gujarat",
      pincode: 395001,
    },
    birthdate: {
      date: 17,
      month: 9,
      year: 1993,
    },
    interest: ["arts", "history"],
    password: "passwordVWX",
  },
];

// Establish a connection to MongoDB
mongoose.connect("mongodb+srv://eventhub:kaustubh26@eventhub.bjmuzqp.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Save all users
User.insertMany(usersData)
  .then((result) => {
    console.log("All users saved successfully:", result);
    mongoose.connection.close(); // Close the connection after saving
  })
  .catch((error) => {
    console.error("Error saving users:", error);
    mongoose.connection.close(); // Close the connection in case of error
  });
