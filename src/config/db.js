const mongoose = require('mongoose');

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected");
    } catch (err) {
        console.error("Database connection error: ", err.message);
        process.exit(1);
    }
};

module.exports = db;