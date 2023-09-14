import Detail from "../models/detail";

const getDetailService = (detail) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detail = await Detail.findOne({ _id: detail._id });
            if (detail) {
                resolve(detail);
                return;
            }
            throw new Error();
        } catch (err) {
            reject("Không tìm thấy");
        }
    });
};

export default getDetailService;
