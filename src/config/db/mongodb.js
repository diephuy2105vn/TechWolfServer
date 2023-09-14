import mongoose from "mongoose";

async function connectMongodb() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/MyApp");
        console.log("Kết nối thành công!!!");
    } catch (e) {
        console.log("Kết nối thất bại");
    }
}

export default connectMongodb;
