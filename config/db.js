import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Clean up stale unique indexes from earlier schema versions.
    try {
      const usersCollection = conn.connection.collection('users');
      const indexes = await usersCollection.indexes();
      const hasLegacyUsernameIndex = indexes.some((index) => index.name === 'username_1');

      if (hasLegacyUsernameIndex) {
        await usersCollection.dropIndex('username_1');
        console.log('Dropped legacy users.username_1 index');
      }
    } catch (indexError) {
      console.warn(`Index cleanup skipped: ${indexError.message}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
