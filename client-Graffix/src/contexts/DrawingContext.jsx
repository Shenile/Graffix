import React, { createContext, useContext, useState } from "react";


const DrawingContext = createContext();


export function DrawingProvider({ children }) {
  const [penColor, setPenColor] = useState('black');

  return (
    <DrawingContext.Provider value={{ penColor, setPenColor }}>
      {children}
    </DrawingContext.Provider>
  );
}


export function useDrawContext() {
  const context = useContext(DrawingContext);

  if (!context) {
    throw new Error("useDrawContext must be used within a DrawingProvider");
  }
  
  return context;
}
