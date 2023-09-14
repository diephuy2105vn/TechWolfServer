import apiRouter from "./apiRoute";
import authRouter from "./authRoute";
import productRouter from "./productRoute";
import cartRouter from "./cartRoute";
function appRouter(app) {
    app.use("/auth", authRouter);
    app.use("/api", apiRouter);
    app.use("/cart", cartRouter);
    app.use("/product", productRouter);
}

export default appRouter;
