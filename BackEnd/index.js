require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http"); // Import HTTP module
const app = express();
const server = http.createServer(app); // Create an HTTP server

require("dotenv").config();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173","http://localhost", "https://white-board-web-application.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());

const user = require("./Routes/User");
const canvasRoutes = require("./Routes/canvasRoutes");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/canvas", canvasRoutes);
app.use("/api/v1/users", user);

const PORT = process.env.PORT || 5000;
const dbConnect = require("./dbConfig/dbConfig");
const wsConnect = require("./dbConfig/wsConfig"); 

try {
  dbConnect();
  console.log("Database connected successfully");
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

// Initialize WebSocket
wsConnect(server);

server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Gracefully shutting down...");
  process.exit(0);
});
