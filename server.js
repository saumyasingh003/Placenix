import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import authRoutes from "./Routes/user.js";
import { errorHandler } from "./Middleware/error.js";
import dotenv from "dotenv";
import profileRoutes from "./Routes/profile.js";
import path from "path";
import coverletterRoutes from "./Routes/coverletter.js";
import resumeRoutes from "./Routes/resume.js";
import jobFormRoutes from "./Routes/company.js";
import applicationRoutes from "./Routes/application.js";





dotenv.config();

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

const handleFileUpload = async  (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "RecruTech");
  data.append("cloud_name", "debfdecp4");


  const res = await fetch("https://api.cloudinary.com/v1_1/debfdecp4/image/upload",{
	method: "POST",
	body: data
});

  const uploadedFile = await res.json();
  console.log("File uploaded successfully:", uploadedFile.url);


  console.log("File upload handler called : ", file);
};

app.get("/", async (req, res) => {
  res.send("API is running...");
});



// Error Handling Middleware
app.use(errorHandler);
connectDB();


app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/coverletter", coverletterRoutes);
app.use("/resume", resumeRoutes);
app.use("/company", jobFormRoutes);
app.use("/application", applicationRoutes);




app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
