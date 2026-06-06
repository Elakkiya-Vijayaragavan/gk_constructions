require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("GK Constructions API Running");
});

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const documentRoutes = require("./routes/documentRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const userRoutes = require("./routes/userRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
