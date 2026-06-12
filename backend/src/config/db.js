const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("Trying to connect to:", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;