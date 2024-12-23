import { useEffect, useState } from 'react';
import { useDrawContext } from '../contexts/DrawingContext';
import { useSocket } from '../contexts/SocketContext';
import { Socket } from 'socket.io-client';

export default function ToolBar() {
  const { penColor, setPenColor } = useDrawContext()
  const [openColourSetting, setOpenColorSetting] = useState(false);
  

  const defaultColors = [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 
    'white', 'gray', 'brown', 'cyan', 'magenta', 'lime', 'indigo', 'violet', 
    'teal', 'gold', 'silver'
  ];

  // Dynamically apply background color using inline styles
  const penColorClass = { backgroundColor: penColor };

  return (
    <div className="relative"> {/* Ensure the parent is relative */}
      <div
        className={`w-6 h-6 rounded-full border 
          border-gray-400 cursor-pointer`} 
        style={penColorClass}
        onClick={() => setOpenColorSetting(!openColourSetting)}
      >
        {/* Color Circle */}
      </div>

      {openColourSetting && (
        <div className="absolute top-12 left-0 w-56 p-2 bg-gray-200 rounded-lg shadow-inner shadow-white z-10">
          <p className="py-2">Default Colors : </p>
          <div className=' grid grid-cols-6 gap-4 mb-2'>
            {defaultColors.map((color, index) => (
              <div
                key={index}
                className='w-6 h-6 rounded-full cursor-pointer border border-gray-400'
                style={{ backgroundColor: color }}
                onClick={() => setPenColor(color)} // Update the pen color
              />
            ))}
          </div>
          <div className='relative'>
            <label htmlFor="color-picker py-2" >Color Picker</label>
            <input 
              type="color" 
              name="color-picker" 
              id="color-picker" 
              className='w-full border border-gray-300 rounded'
              value={penColor} 
              onChange={(e) => setPenColor(e.target.value)} // Update pen color from input
            />
          </div>
        </div>
      )}
    </div>
  );
}
