import mongoose from "mongoose";

function connectDB(){
    const uri = process.env.MONGO_DB_URI;
    if(!uri){
        console.error('MONGO_DB_URI is not set in environment');
        return;
    }

    const options = {
        serverSelectionTimeoutMS: 10000
    };

    mongoose.connect(uri, options)
    .then(()=>{
        console.log('Database connected successfully');
    })
    .catch((err)=>{
        console.error('Database connection failed', err && err.message ? err.message : err);
    });

    mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err && err.message ? err.message : err);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('Mongoose disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('Mongoose connection closed on app termination');
        process.exit(0);
    });
}

export default connectDB;
