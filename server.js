
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
    res.send("Secure Connect Server is Running");
});

// SOCKET.IO
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined ${room}`);
    });

    socket.on("chatMessage", (data) => {
        io.to(data.room).emit("chatMessage", {
            message: data.message,
            sender: data.sender,
            time: new Date()
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// START SERVER
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();
