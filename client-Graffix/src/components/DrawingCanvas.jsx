import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useDrawContext } from "../contexts/DrawingContext";

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { socket, roomCode } = useSocket();
  const { penColor } = useDrawContext();

  // Initialize the canvas
  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineWidth = 2;
    contextRef.current = context;
  };

  // Start drawing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    socket.emit("startDrawing", { roomCode, penColor, offsetX, offsetY });
  };

  // Draw on the canvas
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.strokeStyle = penColor;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    socket.emit("drawing", { roomCode, penColor, offsetX, offsetY });
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
    contextRef.current.closePath();
  };

  // Handle drawing events from other users
  const handleDrawingEvent = (data) => {
    const { offsetX, offsetY, penColor } = data;
    contextRef.current.strokeStyle = penColor;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  // Handle start-drawing events from other users
  const handleStartDrawingEvent = (data) => {
    const { offsetX, offsetY, penColor } = data;
    contextRef.current.strokeStyle = penColor;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
  };

  useEffect(() => {
    prepareCanvas();
    window.addEventListener("resize", prepareCanvas);

    socket.on("drawing", handleDrawingEvent);
    socket.on("startDrawing", handleStartDrawingEvent);

    return () => {
      window.removeEventListener("resize", prepareCanvas);
      socket.off("drawing");
      socket.off("startDrawing");
    };
  }, [socket]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = penColor; 
    }
  }, [penColor]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border border-gray-400 rounded-md cursor-crosshair"
      />
    </div>
  );
};

export default DrawingCanvas;
