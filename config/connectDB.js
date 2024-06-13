const mongoose = require('mongoose');
const dotenv = require('dotenv').config;

const connectDB = async (pathToDB) => {
	try {
		await mongoose.connect(process.env.DATABASE_URL);
		console.log('Connected to MongoDB successfully!');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error.message);
	}
};

module.exports = connectDB;
