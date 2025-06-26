import mongoose  from "mongoose";

export const connectDB = async () => {
    try{
        const {connection} = await mongoose.connect(process.env.DB);
        console.log(`Connected to MongoDB: ${connection.name}`);

    }
    catch(error){
        console.log(error);
    }
}