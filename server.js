import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Database connection
connectDB();

// Route setup
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/chat", chatRoutes);


const activeSockets = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    activeSockets[userId] = socket.id;
    console.log(`User ${userId} joined`);
  });

  socket.on("sendMessage", ({ senderId, recipientId, message }) => {
    const recipientSocket = activeSockets[recipientId];
    const chatMessage = {
      senderId,
      recipientId,
      message,
      timestamp: new Date(),
    };

    if (recipientSocket) {
      io.to(recipientSocket).emit("receiveMessage", chatMessage);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(activeSockets)) {
      if (socketId === socket.id) {
        delete activeSockets[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});


app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Server running on: http://localhost:${PORT}`)
);
