const mongoose = require('mongoose');

/**
 * Connection routine for MongoDB cluster.
 */
module.exports = async function connection () {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.log('Something went wrong...:', error);
        process.exit(1);
    }
};