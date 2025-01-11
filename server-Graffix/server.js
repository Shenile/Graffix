import express from "express";
import { on } from "node:events";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const port = 3000;
const io = new Server(server, {
  cors: {
    origin: "https://graffix-shenile.netlify.app/", // The URL of your client application
    methods: ["GET", "POST"],
  },
});

const rooms = {};
const userPreferences = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Create Room
  socket.on("createRoom", (roomCode, membersCount) => {
    if (rooms[roomCode]) {
      io.to(socket.id).emit("error", "Room already exists");
      return;
    }

    // Create a new room
    rooms[roomCode] = {
      members: [socket.id],
      capacity: parseInt(membersCount, 10),
    };
    socket.join(roomCode);
    console.log(
      `Room created: ${roomCode}, Capacity: ${rooms[roomCode].capacity}`
    );

    io.to(socket.id).emit("roomCreated", roomCode, membersCount);
  });

  socket.on("joinRoom", (roomCode) => {
    const room = rooms[roomCode];

    if (!room) {
      console.log(`Join failed: Room ${roomCode} does not exist`);
      io.to(socket.id).emit("error", "Room is not created yet");
      return;
    }

    if (room.members.length >= room.capacity) {
      console.log(`Join failed: Room ${roomCode} is full`);
      io.to(socket.id).emit("error", "Room is full");
      return;
    }

    room.members.push(socket.id);
    socket.join(roomCode);
    console.log(
      `User ${socket.id} joined room ${roomCode}. Members: ${room.members}`
    );

    const roomData = { members: room.members.length, capacity: room.capacity };
    // Emit updated room data to all members
    io.to(roomCode).emit("roomUpdate", {
      members: room.members.length,
      capacity: room.capacity,
    });

    io.to(socket.id).emit("joinedRoom", roomCode, roomData);
  });

  // setting penColor
  socket.on("setPenColor", (penColor) => {
    userPreferences[socket.id] = penColor;
  });

  // Drawing Events
  socket.on("startDrawing", (data) => {
    const { roomCode, penColor } = data;
    const room = rooms[roomCode];
    if (!room) {
      console.log(`Drawing failed: Room ${roomCode} does not exist`);
      return;
    }
    data = { ...data, penColor };

    // Send to all room members except the sender
    room.members.forEach((socketId) => {
      if (socketId !== socket.id) {
        io.to(socketId).emit("startDrawing", data);
      }
    });
  });

  socket.on("drawing", (data) => {
    const { roomCode } = data;
    const room = rooms[roomCode];
    if (!room) {
      console.log(`Drawing failed: Room ${roomCode} does not exist`);
      return;
    }

    const penColor = userPreferences[socket.id];
    data = { ...data, penColor };

    // Send to all room members except the sender
    room.members.forEach((socketId) => {
      if (socketId !== socket.id) {
        io.to(socketId).emit("drawing", data);
      }
    });
  });

  socket.on("roomData", (roomCode) => {
    const room = rooms[roomCode];

    if (!room) {
      console.log(`Room ${roomCode} does not exist`);
      io.to(socket.id).emit("error", "Room does not exist");
      return;
    }

    const roomData = {
      no_of_members: room.members.length,
      capacity: room.capacity,
    };

    io.to(socket.id).emit("roomData", roomData);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove the user from any room they were part of
    for (const [roomCode, room] of Object.entries(rooms)) {
      const index = room.members.indexOf(socket.id);
      if (index !== -1) {
        room.members.splice(index, 1);
        console.log(`User ${socket.id} removed from room ${roomCode}`);

        // Emit updated room data to all remaining members
        io.to(roomCode).emit("roomUpdate", {
          members: room.members.length,
          capacity: room.capacity,
        });

        // If the room becomes empty, delete it
        if (room.members.length === 0) {
          delete rooms[roomCode];
          console.log(`Room ${roomCode} deleted as it's empty`);
        }
        break;
      }
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hi, server is running");
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});

//hello world