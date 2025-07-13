const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
	try {
		// Connect to database
		await mongoose.connect(process.env.MONGO_URL);
		console.log('Connected to database');

		// Get the users collection
		const db = mongoose.connection.db;
		const usersCollection = db.collection('users');

		// List all indexes
		const indexes = await usersCollection.indexes();
		console.log('Current indexes:', indexes);

		// Check if username index exists
		const usernameIndex = indexes.find(index => 
			index.key && index.key.username === 1
		);

		if (usernameIndex) {
			console.log('Found problematic username index, dropping it...');
			await usersCollection.dropIndex('username_1');
			console.log('Username index dropped successfully');
		} else {
			console.log('No problematic username index found');
		}

		// List indexes again to confirm
		const newIndexes = await usersCollection.indexes();
		console.log('Indexes after fix:', newIndexes);

		console.log('Database fix completed successfully');
		process.exit(0);
	} catch (error) {
		console.error('Error fixing database:', error);
		process.exit(1);
	}
}

fixDatabase(); 