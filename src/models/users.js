import mongoose from "mongoose";
import Cart from "./cart";
import Profile from "./profile";
import Token from "./tokens";
import Order from "./order";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    username: { type: String, require: true },
    password: { type: String },
    provider: { type: String, default: "Account" },
    urlAvatar: {
        type: String,
        default:
            "https://t4.ftcdn.net/jpg/05/49/98/39/240_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
    },
    role: { type: Number, default: 1 },
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
UserSchema.pre(
    "deleteMany",
    { document: true, query: true },
    async function (next) {
        try {
            const docsToDelete = this.getFilter();

            const users = await User.find(docsToDelete).lean();
            console.log(users);
            await Promise.all(
                users.map(async (user) => {
                    //Xóa profile liên quan
                    await Profile.deleteOne({ user: user._id });

                    // Xóa Cart liên quan
                    await Cart.deleteOne({ user: user._id });

                    // Xóa Token liên quan
                    await Token.deleteOne({ user: user._id });

                    await Order.updateMany(
                        { user: user._id },
                        { $unset: { user: 1 } }
                    );
                })
            );
            await next();
        } catch (err) {
            console.log(err);
        }
    }
);

UserSchema.pre(
    "deleteOne",
    { document: true, query: true },
    async function (next) {
        const userId = this._id;
        // Xóa tất cả các Profile liên quan
        await Profile.deleteOne({ user: userId });
        // Xóa tất cả các Cart liên quan
        await Cart.deleteOne({ user: userId });
        // Xóa tất cả các Token liên quan
        await Token.deleteOne({ user: userId });

        await Order.findAndUpdate({ user: userId }, { user: "" });

        next();
    }
);

const User = mongoose.model("User", UserSchema);

export default User;
