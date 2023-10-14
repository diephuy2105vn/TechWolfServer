import Profile from "../models/profile";
const profileController = {
    update: async function (req, res, next) {
        try {
            const profileReq = req.body.data;

            const userId = req.params.id;
            const profile = await Profile.findOneAndUpdate(
                { user: userId },
                {
                    name: profileReq.name,
                    address: profileReq.address,
                    phone: profileReq.phone,
                }
            );
            res.status(200).json({
                status: "Success",
                data: "Update Successfully",
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: "Error",
            });
        }
    },
};

export default profileController;
