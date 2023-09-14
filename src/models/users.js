import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    email: { type: String },
    name: { type: String },
    provider: { type: String, default: "Account" },
    username: { type: String, require: true },
    password: { type: String },
    urlAvatar: {
        type: String,
        default:
            "https://t4.ftcdn.net/jpg/05/49/98/39/240_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
    },
    role: {
        type: Number,
        default: 1,
    },
});

const User = mongoose.model("User", UserSchema);

export default User;
