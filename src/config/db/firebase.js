import admin from "firebase-admin";
import serviceAccount from "../nienluan-c0865-firebase-adminsdk-eyzzx-85f708646c.json";

const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
export default firebase;
