/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */

"use strict";

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Enable mongoose debug mode
mongoose.set("debug", (collectionName, method, query, doc) => {
  console.log(
    `Mongoose: ${collectionName}.${method}`,
    JSON.stringify(query),
    doc || ""
  );
});

// MongoDB configuration
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
