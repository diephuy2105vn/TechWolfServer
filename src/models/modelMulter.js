// configure cloudinary
cloudinary.config({
    cloud_name: "your-cloud-name",
    api_key: "your-api-key",
    api_secret: "your-api-secret",
});

// create cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "your-folder",
        allowed_formats: ["jpeg", "png", "jpg"],
    },
});

// create multer instance
const upload = multer({ storage: storage });

// create express app
const app = express();

// handle file upload
app.post("/upload", upload.array("images"), (req, res) => {
    res.json(req.files);
});
