'use client';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ type: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to the latest message when messages are updated
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error message
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prevMessages) => [...prevMessages, { type: 'user', text: input }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://tushar-bot.tushar-agarwal7373.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        throw new Error('API error');
      }

      const data = await res.json();

      if (data.error) {
        setMessages((prevMessages) => [...prevMessages, { type: 'ai', text: data.error }]);
      } else {
        // Add AI response to chat
        setMessages((prevMessages) => [...prevMessages, { type: 'ai', text: data.response }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.');
      setMessages((prevMessages) => [...prevMessages, { type: 'ai', text: 'There was an error with the request.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen mx-auto bg-white rounded-lg shadow-lg border border-gray-300 ">

      <header className="p-4 bg-blue-600 text-white rounded-t-lg flex items-center justify-center shadow-md">
      <h1 className="text-4xl font-extrabold text-green-400 bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
  <span className="text-gray-800">{"<"}</span> TusharBot <span className="text-gray-800">{" />"}</span>
</h1>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4" ref={chatContainerRef}>
      <p className="max-w-[80%] p-4 rounded-xl text-base mb-4 shadow-md bg-gray-100 text-gray-800 self-start animate-slideInLeft">
  Welcome! How can I assist you today? Feel free to ask any questions or provide details, and I’ll be happy to help.
</p>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[80%] p-4 rounded-xl text-base mb-4 shadow-md ${
              message.type === 'user'
                ? 'bg-blue-600 text-white self-end animate-slideInRight'
                : 'bg-gray-100 text-gray-800 self-start animate-slideInLeft'
            }`}
          >
            {message.text}
          </div>
        ))}
        {loading && (
          <div className="max-w-[80%] p-4 rounded-xl text-base mb-4 bg-gray-100 text-gray-800 self-start">
            <div className="flex space-x-2 animate-pulse">
              <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
              <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
              <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
            </div>
          </div>
        )}
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>

      {/* Input and Button */}
      <form onSubmit={handleSubmit} className="flex p-4 bg-white border-t border-gray-300">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 rounded-full text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        />
        <button
          type="submit"
          className="ml-4 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 shadow-md"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
              <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
              <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
            </div>
          ) : (
            'Send'
          )}
        </button>
      </form>
    </div>
  );
}
