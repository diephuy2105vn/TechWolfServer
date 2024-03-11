import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const TokenSchema = new Schema({
    user: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
});

const Token = mongoose.model("Token", TokenSchema);

export default Token;
