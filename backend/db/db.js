import mongoose from "mongoose";

function connectDB(){
    mongoose.connect(process.env.MONGO_DB_URI)
    .then(()=>{
        console.log('Database connected successfully');
    })
    .catch((err)=>{
        console.log('Database connection failed', err);
    });
}

export default connectDB;
