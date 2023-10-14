import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProfileSchema = new Schema(
    {
        name: { type: String, default: "" },
        address: { type: String, default: "" },
        phone: { type: String, default: "" },
        user: {
            type: ObjectId,
            ref: "User",
            require: true,
        },
    },
    {
        timestamps: {
            createdAt: "dateCreate",
            updatedAt: "dateUpdate",
        },
    }
);

const Profile = mongoose.model("Profile", ProfileSchema);

export default Profile;
