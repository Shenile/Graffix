import React, { useEffect } from "react";
import DrawingCanvas from "./DrawingCanvas";
import ToolBar from "./ToolBar";
import { useSocket } from "../contexts/SocketContext";

export default function DrawingPage() {
  const { socket, roomData, setRoomData } = useSocket();

  const handleRoomUpdate = (data) => {
    
    setRoomData(prevState => ({
      ...prevState,
      members: data.members, 
      capacity: data.capacity, 
    }));
  };

  

  useEffect(() => {
    socket.on("roomUpdate", handleRoomUpdate);

    
    return () => {
      socket.off("roomUpdate", handleRoomUpdate);
    };
  }, [socket, roomData]); 
  return (
    <div className="flex flex-col gap-2 justify-center items-center px-4 h-full w-full dark:bg-gray-900">
      <div className="flex gap-4 items-center w-fit">
        <p className="mr-8 font-semibold">Room members : {roomData?.members} / {roomData?.capacity}</p>
        <h1 className="font-semibold">Pen Color :</h1>
        <ToolBar />
      </div>

      <div className="flex justify-center w-full">
        <DrawingCanvas />
      </div>
    </div>
  );
}
