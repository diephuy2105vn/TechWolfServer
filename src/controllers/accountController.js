import User from "../models/users";

const accountController = {
    deleteMultiple: async (req, res) => {
        try {
            const ids = req.body.ids;
            const result = await User.deleteMany({ _id: { $in: ids } });
            if (!result) {
                throw new Error();
            }
            res.json({
                status: "Success",
                message: "Delete Account Successfully",
            });
        } catch (err) {
            res.json({
                status: "Error",
                message: "Delete Account Failed",
            });
        }
    },
};
export default accountController;
