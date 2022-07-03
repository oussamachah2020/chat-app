import { Avatar } from "@mui/material";
import React, { useState } from "react";
import "./Chat.css";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import axios from "./axios";

function Chat({ messages }) {
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:8080/messages/new", {
      message: input,
      name: "Demo App",
      timestamp: new Date(),
      received: false,
    });

    setInput("");
  };

  return (
    <div className="Chat">
      <div className="chat_header">
        <Avatar />

        <div className="chat_headerInfo">
          <h3>Room name</h3>
          <p>Last seen at ...</p>
        </div>

        <div className="char_headerRight">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((message) => (
          <p className={`chat_message ${message.received && "chat_reciever"}`}>
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat_timestamp">{message.timestamp}</span>
          </p>
        ))}
        {/* <p className="chat_message"> */}
        {/*   <span className="chat_name">Oussama</span> */}
        {/*   This is a message */}
        {/*   <span className="chat_timestamp">{new Date().toUTCString()}</span> */}
        {/* </p> */}
        <p className="chat_message chat_reciever">
          <span className="chat_name">Aymen</span>
          This is a message
          <span className="chat_timestamp">{new Date().toUTCString()}</span>
        </p>
      </div>
      <div className="chat_footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <KeyboardVoiceIcon />
      </div>
    </div>
  );
}

export default Chat;
