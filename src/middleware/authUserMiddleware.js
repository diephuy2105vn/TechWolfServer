import authService from "../services/authService";

async function authUserMiddleWare(req, res, next) {
    try {
        const refreshToken = req.cookies["refreshToken"];
        const verifyToken = await authService.verifyToken(refreshToken);

        if (verifyToken) {
            return next();
        }
        res.status(400).json({
            status: "Error",
            message: "Permission denied!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "Error", message: "Lỗi server" });
    }
}

export default authUserMiddleWare;
