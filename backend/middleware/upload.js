import multer from "multer";
import path from "path";

// Storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "profileImage") {
            cb(null, "uploads/profiles");
        } else if (file.fieldname === "companyLogo") {
            cb(null, "uploads/logos");
        } else {
            cb(null, "uploads/resumes");
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter: allow Images and PDFs
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images (JPEG, PNG, WEBP) and PDF files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;
