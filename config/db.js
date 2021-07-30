import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        // console.log("MongoDB Connected");
    } catch (error) {
        console.log(`Error ${error}`, error.message);
        process.exit(1);
    } 
}

export default connectDB;   