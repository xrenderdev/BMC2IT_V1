const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Ensure upload directory exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Route to handle file uploads
app.post("/upload", upload.array("images", 10), (req, res) => {
    res.json({ message: "Files uploaded successfully!", files: req.files });
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://${getLocalIP()}:${PORT}`);
});

// Helper function to get your local IP address
function getLocalIP() {
    const os = require("os");
    const interfaces = os.networkInterfaces();
    for (let iface of Object.values(interfaces)) {
        for (let config of iface) {
            if (config.family === "IPv4" && !config.internal) {
                return config.address;
            }
        }
    }
    return "localhost";
}

