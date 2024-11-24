import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors({ origin: "client-url" }));

dotenv.config();

const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(`server running on : http://localhost:${port}`);
});
