import React, { useEffect } from "react";
import DrawingCanvas from "./DrawingCanvas";
import ToolBar from "./ToolBar";
import { useSocket } from "../contexts/SocketContext";

export default function DrawingPage() {
  const { socket, roomData, setRoomData } = useSocket();

  const handleRoomUpdate = (data) => {
    // Update only necessary room data (e.g., members count)
    setRoomData(prevState => ({
      ...prevState,
      members: data.members, // Assuming 'data' has updated members count
      capacity: data.capacity, // Assuming 'data' has updated capacity
    }));
  };

  

  useEffect(() => {
    socket.on("roomUpdate", handleRoomUpdate);

    // Cleanup the socket event listener on component unmount
    return () => {
      socket.off("roomUpdate", handleRoomUpdate);
    };
  }, [socket, roomData]); // No need to include roomData here

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
