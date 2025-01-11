import { useEffect, useState } from "react";
import React from "react";
import { useSocket } from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";

export const useRoomValidation = () => {
  const [errors, setErrors] = useState({ roomCode: "", membersCount: "" });

  const validateRoomInputs = (roomCode, membersCount) => {
    let isValid = true;
    const newErrors = { roomCode: "", membersCount: "" };

    // Validate room code: must be an integer and not more than 6 digits
    if (roomCode !== null && (!/^\d+$/.test(roomCode) || roomCode.length > 6)) {
      isValid = false;
      newErrors.roomCode = "Room code must be an integer up to 6 digits.";
    }

    // Validate members count: must be an integer between 1 and 11
    if (membersCount !== null) {
      const members = parseInt(membersCount, 10);
      if (isNaN(members) || members < 1 || members > 11) {
        isValid = false;
        newErrors.membersCount =
          "Members count must be an integer between 1 and 11.";
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  return { errors, validateRoomInputs };
};

// Reusable Input Component
const InputField = ({ label, value, onChange, placeholder, error }) => (
  <div className="flex flex-col gap-1">
    <label className="font-semibold">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`border ${
        error ? "border-red-500" : "border-gray-400"
      } focus:border-black rounded-md p-4 font-semibold placeholder:font-normal`}
    />
    {error && <span className="text-red-500">{error}</span>}
  </div>
);

function CreateRoom({ onBack }) {
  const { setRoomCode, setMembersCount, socket, setRoomData } = useSocket();
  const { errors, validateRoomInputs } = useRoomValidation();
  const [roomCode, setRoomCodeInput] = useState("");
  const [membersCount, setMembersCountInput] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (validateRoomInputs(roomCode, membersCount)) {
      socket.emit("createRoom", roomCode, membersCount);
    }
  };

  useEffect(() => {
    const handleRoomCreated = (roomCode, membersCount) => {
      setRoomCode(roomCode);
      setRoomData({members: 1, capacity : membersCount});
      navigate("/draw");
      alert(`Room created with code: ${roomCode}`);
    };

    socket.on("roomCreated", handleRoomCreated);

    return () => {
      socket.off("roomCreated", handleRoomCreated);
    };
  }, [socket, setRoomCode, navigate]);

  return (
    <div className="px-8 py-12 flex flex-col gap-4 md:w-1/4 border border-gray-400 rounded-xl shadow-lg">
      <InputField
        label="Room Code"
        value={roomCode}
        onChange={setRoomCodeInput}
        placeholder="Enter your room code..."
        error={errors.roomCode}
      />
      <InputField
        label="Members Count"
        value={membersCount}
        onChange={setMembersCountInput}
        placeholder="Enter members count..."
        error={errors.membersCount}
      />
      <div className="flex gap-4 justify-end">
        <button
          onClick={onBack}
          className="px-4 py-3 rounded-full font-semibold border border-black hover:bg-black hover:text-white"
        >
          Discard
        </button>
        <button
          onClick={handleCreateRoom}
          className="px-4 py-3 rounded-full font-semibold border border-black hover:bg-black hover:text-white"
        >
          Create Room
        </button>
      </div>
    </div>
  );
}

function JoinRoom({ onBack }) {
  const { setRoomCode, setRoomData } = useSocket();
  const { errors, validateRoomInputs } = useRoomValidation();
  const [roomCode, setRoomCodeInput] = useState("");
  const { socket } = useSocket();
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (validateRoomInputs(roomCode, null)) {
      socket.emit("joinRoom", roomCode);
    }
  };

  useEffect(() => {
    const handleJoinedRoom = (roomCode, roomData) => {
      setRoomCode(roomCode);
      setRoomData(roomData);
      navigate("/draw");
    };
    socket.on("joinedRoom", handleJoinedRoom);

    return () => {
      socket.off("joinedRoom", handleJoinedRoom);
    };
  }, [socket, setRoomCode, navigate]);

  return (
    <div className="px-8 py-12 flex flex-col gap-4 md:w-1/4 border border-gray-400 shadow-lg rounded-xl">
      <InputField
        label="Room Code"
        value={roomCode}
        onChange={setRoomCodeInput}
        placeholder="Enter room code to join..."
        error={errors.roomCode}
      />
      <div className="flex gap-4 justify-end">
        <button
          onClick={onBack}
          className="px-4 py-3 rounded-full font-semibold border border-black hover:bg-black hover:text-white"
        >
          Discard
        </button>
        <button
          onClick={handleJoinRoom}
          className="px-4 py-3 rounded-full font-semibold border border-black hover:bg-black hover:text-white"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}

export default function RoomCard() {
  const [activeView, setActiveView] = useState(null);

  const renderView = () => {
    switch (activeView) {
      case "create":
        return <CreateRoom onBack={() => setActiveView(null)} />;
      case "join":
        return <JoinRoom onBack={() => setActiveView(null)} />;
      default:
        return (
          <div className="px-40 flex flex-col gap-12 pt-40 items-center h-full w-full">
            <p className="w-3/4 text-lg">
              {`Jump in and draw together on a shared whiteboard! Create or join rooms to doodle, sketch, and pick your favorite pen colors.
            It's a simple, fun way to collaborate and let your creativity flow!`}
            </p>

            <div className="flex gap-4 items-center w-3/4">
              <button
                onClick={() => setActiveView("create")}
                className="px-4 py-3 hover:bg-black hover:text-white border border-black  rounded-full"
              >
                <p className="text-lg font-semibold">Create Room</p>
              </button>
              <button
                onClick={() => setActiveView("join")}
                className="px-4 py-3 hover:bg-black hover:text-white border border-black  rounded-full"
              >
                <p className="text-lg font-semibold">Join Room</p>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      {renderView()}
    </div>
  );
}
