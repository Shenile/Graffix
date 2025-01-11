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
   
    const newSocket = io('https://graffix.onrender.com/');  
    setSocket(newSocket);

    
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, roomCode, setRoomCode, roomData, setRoomData }}>
      {children}
    </SocketContext.Provider>
  );
};
