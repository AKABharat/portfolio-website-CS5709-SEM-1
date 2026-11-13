const mongoose = require("mongoose");

/** Connects to MongoDB using MONGO_URI, exiting the process if it fails. */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB (database) connected");
  } catch (err) {
    console.log("DB CONNECTION ERROR: ", err);
    process.exit(1);
  }
};

module.exports = { connectDB };
