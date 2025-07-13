const mongoose = require('mongoose');
require('dotenv').config();

const migrateDatabase = async () => {
	try {
		console.log('Starting database migration...');
		
		// Connect to database
		await mongoose.connect(process.env.MONGO_URL);
		console.log('Connected to database');
		
		const db = mongoose.connection.db;
		
		// Check and remove legacy username index
		const collections = await db.listCollections().toArray();
		const usersCollection = collections.find(col => col.name === 'users');
		
		if (usersCollection) {
			console.log('Found users collection, checking indexes...');
			const indexes = await db.collection('users').indexes();
			
			// Find and remove username index
			const usernameIndex = indexes.find(index => 
				index.key && index.key.username === 1
			);
			
			if (usernameIndex) {
				console.log('Removing legacy username index...');
				await db.collection('users').dropIndex('username_1');
				console.log('✅ Legacy username index removed successfully');
			} else {
				console.log('✅ No legacy username index found');
			}
			
			// Ensure email index exists
			const emailIndex = indexes.find(index => 
				index.key && index.key.email === 1
			);
			
			if (!emailIndex) {
				console.log('Creating email index...');
				await db.collection('users').createIndex({ email: 1 }, { unique: true });
				console.log('✅ Email index created successfully');
			} else {
				console.log('✅ Email index already exists');
			}
		}
		
		console.log('Database migration completed successfully');
		process.exit(0);
		
	} catch (error) {
		console.error('Migration failed:', error);
		process.exit(1);
	}
};

// Run migration if this file is executed directly
if (require.main === module) {
	migrateDatabase();
}

module.exports = migrateDatabase; 