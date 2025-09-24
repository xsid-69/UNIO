import './config/env.js';  // Import env config first
import app from './src/app.js';
import connectDB from './db/db.js';

connectDB();
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
