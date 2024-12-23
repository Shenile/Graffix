// src/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { data } from 'react-router-dom';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [roomData, setRoomData] = useState({members : 0, capacity: 0});

  const handleRoomData = (data) =>{
    setRoomData(data);
  }
  useEffect(()=>{
    if(roomCode){
      socket.on("roomData", handleRoomData);

      return ()=>{
        socket.off("roomData", handleRoomData)
      }
    }
  }, [roomCode])
  useEffect(() => {
    // Connect to the socket.io server
    const newSocket = io('http://localhost:3000');  // Replace with your server URL
    console.log(newSocket)
    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, roomCode, setRoomCode, roomData, setRoomData }}>
      {children}
    </SocketContext.Provider>
  );
};
