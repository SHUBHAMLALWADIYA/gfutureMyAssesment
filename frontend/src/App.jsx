import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:8010");
function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    
    socket.on("receive_message", (data) => {
      console.log("msg dtaa")
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log(messages)
    });
    socket.on("users", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    return () => {
      socket.off("receive_message");
      socket.off("users");
    };
  }, []);

  const handleJoin = () => {
    if (username.length >= 0) {
      socket.emit("join", username);
      setIsJoined(true);
    }else{
      alert("first enter your name")
    }
  };

  const sendMessage = () => {
    console.log("first")
    if (message) {
      console.log(message)
      const data = { username, message };
      console.log(data)
      socket.emit("send_message", data);
      console.log("messages",messages)
      setMessages((prevMessages) => [...prevMessages, data]);
      setMessage("");
    }
  };

  return (
    <div className="app">
      {!isJoined ? (
        <div className="join-container">
          <input
            type="text"
            placeholder="Enter Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleJoin}>Submit</button>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <h3>
              Welcome <span className="username-highlight">{username}</span>
            </h3>
          </div>
          <div className="users">
            <h3>Users</h3>
            <div className="user-tags">
              {users.map((user) => (
                <span key={user.id}>{user.username}</span>
              ))}
            </div>
          </div>
          <div className="chat">
            <div className="messages">
              {messages.map((msg, index) =>{ 
                console.log("msg" ,msg)
                return(
                <div key={index}>
                  <strong>{msg.username}</strong>
                  {""}
                  {msg.message}
                </div>
              )})}
            </div>
            <div className="input-container">
              <input 
              type="text"
              placeholder="Enter Your Message"
              value={message} 
              onChange={(e)=>setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
