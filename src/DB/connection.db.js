import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        const uri = "mongodb+srv://samuelmagdy:4sj2PS67F2j-_C_@cluster0.war2p12.mongodb.net/sarahaApp"
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