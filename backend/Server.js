import './config/env.js';  // Import env config first
import app from './src/app.js';
import connectDB from './db/db.js';
import "./config/passport.config.js";

connectDB();
app.listen(process.env.PORT || 3000,()=>{
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})
