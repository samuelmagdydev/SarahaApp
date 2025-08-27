import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        const uri = process.env.DB_URI 
        const result = await mongoose.connect(uri,{
            serverSelectionTimeoutMS : 30000
        })
        console.log(result.models);
        console.log(`DB Connected successfully ❤ `);
        
        
    } catch (error) {
        console.log(`Fail To Connect To DB`, error);
        
    }
}

export default connectDB