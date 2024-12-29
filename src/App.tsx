import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState<string[]>(["Hello from server!"]);
  const wsRef = useRef<WebSocket | null>(null); // WebSocket connection reference
  const inputRef = useRef<HTMLInputElement | null>(null); // Input field reference
  const messageEndRef = useRef<HTMLDivElement | null>(null); // Ref to auto-scroll to the latest message
  const typingTimeoutRef = useRef<number | null>(null); // Ref to manage typing timeout

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]); // Add new message to messages array
    };

    // Store WebSocket connection in ref for later use
    wsRef.current = ws;

    // When connection opens, send join room message
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red", // Join room with ID "red"
          },
        })
      );
    };

    // Cleanup: close WebSocket when component unmounts
    return () => {
      ws.close();
    };
  }, []);

  // Scroll to the bottom whenever a new message is added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle input field typing
  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current); // Clear any previous timeout for stopping typing indication
    }

    typingTimeoutRef.current = setTimeout(() => {
      // You can send a typing event or do something here
    }, 1000); // 1 second delay
  };

  const handleSendMessage = () => {
    const message = inputRef.current?.value;
    if (message && wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: message,
          },
        })
      );
      if (inputRef.current) {
        inputRef.current.value = ''; // Clear input field
      }
    }
  };

  const handleClearChat = () => {
    setMessages([]); // Clear all chat messages
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Message Display Area */}
      <div className="flex-1 overflow-auto p-6 bg-black">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-4`}
          >
            <span
              className={`${
                index % 2 === 0 ? 'bg-white text-black' : 'bg-white text-black'
              } p-4 rounded-xl shadow-lg max-w-xs break-words transition-all duration-300 ease-in-out transform hover:scale-105`}
            >
              {message}
            </span>
          </div>
        ))}
        <div ref={messageEndRef} /> {/* Auto-scroll to latest message */}
      </div>

      {/* Message Input & Send Button */}
      <div className="w-full bg-black flex items-center p-4">
        <input
          ref={inputRef}
          id="message"
          className="flex-1 p-3 rounded-md bg-gray-800 text-white border-2 border-transparent focus:outline-none focus:border-purple-500 transition-all duration-200 ease-in-out"
          placeholder="Type a message..."
          onInput={handleTyping}
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 px-6 py-3 bg-purple-600 text-white rounded-md shadow-lg transition-all duration-200 ease-in-out hover:bg-purple-700 focus:outline-none"
        >
          Send
        </button>
        {/* Clear Chat Button */}
        <button
          onClick={handleClearChat}
          className="ml-3 px-6 py-3 bg-red-600 text-white rounded-md shadow-lg transition-all duration-200 ease-in-out hover:bg-red-700 focus:outline-none"
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
}

export default App;
