import jwt from "jsonwebtoken";

function generateToken(user, secretKey, tokenLife) {
    return new Promise(async (resolve, rejects) => {
        try {
            const userData = {
                userId: user._id,
                role: user.role,
                username: user.username,
            };

            const token = await jwt.sign({ data: userData }, secretKey, {
                algorithm: "HS256",
                expiresIn: tokenLife,
            });
            resolve(token);
        } catch (err) {
            rejects(err);
        }
    });
}
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, "shhh", (error, decoded) => {
            if (error) {
                return reject(error);
            }
            resolve(decoded);
        });
    });
};

export default { generateToken, verifyToken };
