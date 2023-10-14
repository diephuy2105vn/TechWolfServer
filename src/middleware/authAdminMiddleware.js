import authService from "../services/authService";

async function authAdminMiddleWare(req, res, next) {
    const refreshToken = req.cookies["refreshToken"];
    const verifyToken = await authService.verifyToken(refreshToken);

    if (verifyToken.data.role >= 3) {
        return next();
    }
    res.status(400).json({ status: "Error", message: "Permission denied!" });
}

export default authAdminMiddleWare;
