import User from "../models/users";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import authService from "../services/authService";
import Token from "../models/tokens";
import { getAuth } from "firebase-admin/auth";
import Cart from "../models/cart";
dotenv.config();
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const authController = {
    register: async function (req, res, next) {
        try {
            const account = {
                username: req.body.username.toLowerCase(),
                password: req.body.password,
            };

            const user = await User.findOne({
                username: account.username,
            });
            if (user) {
                res.status(500).json({
                    status: "Error",
                    username: "Tên tài khoản đã tồn tại",
                });
                return;
            }
            const userNew = await new User(account);
            const cartNew = await new Cart({ user: userNew._id });
            const salt = await bcrypt.genSalt(10);
            userNew.password = await bcrypt.hash(userNew.password, salt);
            await userNew.save();
            await cartNew.save();
            res.status(200).json({
                status: "Success",
                data: "Tạo tài khoản thành công",
            });
        } catch (err) {
            res.status(500).json({
                Status: "Error",
            });
        }
    },
    login: async function (req, res, next) {
        try {
            const account = {
                username: req.body.username.toLowerCase(),
                password: req.body.password,
            };
            const user = await User.findOne({
                username: account.username,
                provider: "Account",
            }).lean();
            if (!user) {
                res.status(404).json({
                    status: "Error",
                    username: "Tên tài khoản không tồn tại",
                });
                return;
            }

            const validPassword = await bcrypt.compare(
                account.password,
                user.password
            );

            if (!validPassword) {
                res.status(404).json({
                    status: "Error",
                    password: "Mật khẩu không hợp lệ",
                });
                return;
            }
            if (user && validPassword) {
                const { password, ...userRes } = user;

                const accessToken = await authService.generateToken(
                    userRes,
                    accessTokenSecret,
                    accessTokenLife
                );
                const refreshToken = await authService.generateToken(
                    userRes,
                    refreshTokenSecret,
                    refreshTokenLife
                );

                const token = await Token.findOne({ user: userRes._id });

                if (!token) {
                    const tokenNew = await new Token({
                        user: userRes._id,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    });
                    await tokenNew.save();
                } else {
                    token.accessToken = accessToken;
                    token.refreshToken = refreshToken;
                    await token.save();
                }
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                res.status(200).json({
                    status: "Success",
                    user: userRes,
                    accessToken: accessToken,
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: "Error", data: "Đã có lỗi xảy ra" });
        }
    },
    refresh: async function (req, res, next) {
        try {
            const refreshToken = req.cookies["refreshToken"];
            const verifyToken = await authService.verifyToken(refreshToken);
            if (verifyToken) {
                const token = await Token.findOne({
                    refreshToken: refreshToken,
                })
                    .populate({
                        path: "user",
                        model: "User",
                    })
                    .lean();

                const user = token.user;
                const accessToken = await authService.generateToken(
                    user,
                    accessTokenSecret,
                    accessTokenLife
                );

                const { password, ...userRes } = user;
                res.status(200).json({
                    status: "Success",
                    user: userRes,
                    accessToken: accessToken,
                });
            } else {
                res.status(400).json({
                    status: "Error",
                    data: "Token không hợp lệ",
                });
            }
        } catch (err) {
            res.status(500).json({ status: "Error", data: "Đã có lỗi xảy ra" });
        }
    },

    loginWithGoogle: async function (req, res, next) {
        try {
            const accessToken = req.body.stsTokenManager.accessToken;
            const verifyToken = await getAuth().verifyIdToken(accessToken);
            if (verifyToken) {
                const userReq = {
                    username: req.body.email.toLowerCase(),
                    urlAvatar: req.body.photoURL,
                    provider: "Email",
                };
                const user = await User.findOne({
                    username: userReq.username,
                    provider: userReq.provider,
                }).lean();
                if (user) {
                    const { password, ...userRes } = user;
                    const refreshToken = await authService.generateToken(
                        userRes,
                        refreshTokenSecret,
                        refreshTokenLife
                    );
                    const token = await Token.findOne({
                        user: userRes._id,
                    });
                    token.refreshToken = refreshToken;
                    token.accessToken = accessToken;
                    await token.save();
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: false,
                        path: "/",
                        sameSite: "strict",
                    });
                    res.status(200).json({
                        status: "Success",
                        user: userRes,
                        accessToken: accessToken,
                    });
                    return;
                }
                const userNew = await new User(userReq);
                const cartNew = await new Cart({ user: userNew._id });
                const refreshToken = await authService.generateToken(
                    userNew,
                    refreshTokenSecret,
                    refreshTokenLife
                );
                const tokenNew = await new Token({
                    user: userNew._id,
                    refreshToken: refreshToken,
                    accessToken: accessToken,
                });
                await userNew.save();
                await cartNew.save();
                await tokenNew.save();
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                res.status(200).json({
                    status: "Success",
                    user: userNew,
                    accessToken: accessToken,
                });
                return;
            }
        } catch (err) {
            res.status(500).json({
                status: "Error",
                data: "Đăng nhập thất bại vui lòng thử lại sau",
            });
        }
    },
    logout: async function (req, res, next) {
        try {
            const refreshToken = req.cookies["refreshToken"];
            const verifyToken = await authService.verifyToken(refreshToken);
            if (verifyToken) {
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                res.status(200).json({
                    status: "Success",
                    data: "Đăng xuất thành công",
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: "Error",
                data: "Đăng xuất thất bại vui lòng thử lại",
            });
        }
    },
};

export default authController;
