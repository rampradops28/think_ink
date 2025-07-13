const mongoose = require('mongoose')

const connectDB = async (connectionString) => {
	const conn = await mongoose.connect(connectionString);
	
	// Clean up legacy indexes that might cause issues
	try {
		const db = mongoose.connection.db;
		const collections = await db.listCollections().toArray();
		
		// Check if users collection exists and has legacy username index
		const usersCollection = collections.find(col => col.name === 'users');
		if (usersCollection) {
			const indexes = await db.collection('users').indexes();
			const usernameIndex = indexes.find(index => 
				index.key && index.key.username === 1
			);
			
			if (usernameIndex) {
				console.log('Removing legacy username index...');
				await db.collection('users').dropIndex('username_1');
				console.log('Legacy username index removed successfully');
			}
		}
	} catch (error) {
		console.log('Index cleanup warning:', error.message);
	}
	
	return conn;
};

module.exports = connectDB;