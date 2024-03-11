import apiRouter from "./apiRoute";
import authRouter from "./authRoute";
import productRouter from "./productRoute";
import cartRouter from "./cartRoute";
import orderRouter from "./orderRoute";
import profileRouter from "./profileRoute";
import accountRouter from "./accountRoute";
import authUserMiddleWare from "../middleware/authUserMiddleware";
import authAdminMiddleWare from "../middleware/authAdminMiddleware";
function appRouter(app) {
    app.use("/auth", authRouter);
    app.use("/api", apiRouter);
    app.use("/cart", cartRouter);
    app.use("/product", authAdminMiddleWare, productRouter);
    app.use("/order", orderRouter);
    app.use("/profile", authUserMiddleWare, profileRouter);
    app.use("/account", authAdminMiddleWare, accountRouter);
}

export default appRouter;
