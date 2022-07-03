import Sidebar from "./Sidebar";
import Chat from "./Chat";
import "./App.css";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "./axios";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/messages/sync");
        setMessages(response.data);
      } catch (error) {
        console.error(error.response);
      }
    }
    console.log(getUser());
  }, []);

  useEffect(() => {
    var pusher = new Pusher("a039135c771dfbc1ad70", {
      cluster: "eu",
    });

    var channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessages) => {
      setMessages([...messages, newMessages])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages]);

  console.log(messages);

  return (
    <div class="app">
      <div className="app_body">
        <Sidebar />
        <Chat messages={messages} />
      </div>
    </div>
  );
}

export default App;
