const { Server } = require("socket.io")

const wsConnect = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  })

  // Store canvas data in memory (for real apps, consider using Redis)
  const canvasData = {}

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id)

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)
    })

    socket.on("joinCanvas", ({ canvasId }) => {
      console.log(`User ${socket.id} joined canvas: ${canvasId}`)
      socket.join(canvasId)

      // Send existing canvas data to the newly joined user
      if (canvasData[canvasId]) {
        socket.emit("loadCanvas", canvasData[canvasId])
      }
    })

    socket.on("updateCanvas", ({ canvasId, elements }) => {
      console.log(`Updating canvas ${canvasId} with ${elements.length} elements`);

      // Store the latest canvas state
      canvasData[canvasId] = elements;

      // Broadcast updated canvas to all users **including the sender**
      io.to(canvasId).emit("receiveDrawingUpdate", elements);
    });
  })

  return io;
}

module.exports = wsConnect