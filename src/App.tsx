import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState<string[]>(["Hello from server!"]);
  const wsRef = useRef<WebSocket | null>(null); 
  const inputRef = useRef<HTMLInputElement | null>(null); 
  const messageEndRef = useRef<HTMLDivElement | null>(null); 
  const typingTimeoutRef = useRef<number | null>(null); 

  useEffect(() => {
    const wsUrl = " https://chatappback-8uleortzv-ramdeniakkis-projects.vercel.app"; 
const ws = new WebSocket(wsUrl);


    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

   
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red", 
          },
        })
      );
    };

    return () => {
      ws.close();
    };
  }, []);

 
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current); 
    }

    typingTimeoutRef.current = setTimeout(() => {
    
    }, 1000);
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
        inputRef.current.value = ''; 
      }
    }
  };

  const handleClearChat = () => {
    setMessages([]); 
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
                index % 2 === 0 ? 'bg-gray-100 text-black' : 'bg-purple-600 text-white'
              } p-4 rounded-xl shadow-lg max-w-xs break-words transition-all duration-300 ease-in-out transform hover:scale-105`}
            >
              {message}
            </span>
          </div>
        ))}
        <div ref={messageEndRef} /> 
      </div>

      
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
