import mongoose from "mongoose";
import Cart from "./cart";
import Profile from "./profile";
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

UserSchema.pre(
    "deleteOne",
    { document: true, query: true },
    async function (next) {
        const user = this;
        await Cart.deleteOne({ user: user._id });
        await Profile.deleteOne({ user: user._id });
        next();
    }
);

UserSchema.pre("save", async function (next) {
    const user = this;

    if (user.isNew) {
        const profile = new Profile({ user: user._id });
        const cart = new Cart({ user: user._id });

        await profile.save();
        await cart.save();
    }

    next();
});

const User = mongoose.model("User", UserSchema);

export default User;
