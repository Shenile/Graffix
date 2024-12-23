import React, { createContext, useContext, useState } from "react";

// Create the DrawingContext
const DrawingContext = createContext();

// Provider Component
export function DrawingProvider({ children }) {
  const [penColor, setPenColor] = useState('black');

  return (
    <DrawingContext.Provider value={{ penColor, setPenColor }}>
      {children}
    </DrawingContext.Provider>
  );
}

// Custom Hook for consuming the context
export function useDrawContext() {
  const context = useContext(DrawingContext);

  if (!context) {
    throw new Error("useDrawContext must be used within a DrawingProvider");
  }
  
  return context;
}
