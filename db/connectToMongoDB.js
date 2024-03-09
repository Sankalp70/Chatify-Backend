import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://sankalp:lopa9990@cluster0.clkjatq.mongodb.net/testQuiz?retryWrites=true&w=majority&appName=Cluster0");
    console.log("connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to MongoDB", err.message);
  }
};

export default connectToMongoDB;
