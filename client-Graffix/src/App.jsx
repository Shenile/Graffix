import DrawingPage from "./components/DrawingPage";
import RoomCard from "./components/RoomCard";
import { DrawingProvider } from "./contexts/DrawingContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  // const [messages, setMessages] = useState([]);
  // const [msg, setMsg] = useState("");
  // const socket = useSocket();

  // // Listen for new messages from the server
  // useEffect(() => {
  //   if (socket) {
  //     socket.on("chatMessage", (newMessage) => {
  //       setMessages((prevMessages) => [...prevMessages, newMessage]);
  //     });
  //   }

  //   // Cleanup the event listener when the component unmounts
  //   return () => {
  //     if (socket) socket.off("chatMessage");
  //   };
  // }, [socket]);

  // // Handle sending a message
  // const handleSendMessage = () => {
  //   if (socket && msg) {
  //     socket.emit("chatMessage", msg); // Emit the message with the correct variable
  //     setMsg(""); // Clear the input field
  //   }
  // };

  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="px-40 pt-6 p-4">
        <h1 className="text-2xl font-sans font-bold">Graffix</h1>

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
