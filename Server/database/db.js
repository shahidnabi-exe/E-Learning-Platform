import mongoose  from "mongoose";
const url="mongodb://localhost:27017/ELearningPlatform"
export const connectDB = async () => {
    try{
        const {connection} = await mongoose.connect(url);
        console.log(`Connected to MongoDB: ${connection.name}`);

    }
    catch(error){
        console.log(error);
    }
}