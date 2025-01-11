import DrawingPage from "./components/DrawingPage";
import RoomCard from "./components/RoomCard";
import { DrawingProvider } from "./contexts/DrawingContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="px-40 pt-6 p-4 ">
        <img src="/scribble.png" alt="draw-icon" className="inline w-8 h-8 mr-4"/>
        <h1 className="text-2xl font-sans font-bold inline">Graffix</h1>
      </div>

      <Router>
        <DrawingProvider>
          <Routes>
            <Route path="/" element={<RoomCard/>}/>
            <Route path="/draw" element={<DrawingPage/>}/>
          </Routes>
        </DrawingProvider>
      </Router>

      <div className="flex gap-4 justify-center p-4 md:pb-8"></div>
    </div>
  );
}

export default App;
