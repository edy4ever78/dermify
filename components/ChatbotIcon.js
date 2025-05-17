'use client';

import { useState, useRef, useEffect } from 'react';

const ChatbotIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hello! I\'m your skincare assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      // Call Ollama API running in Docker
      // Using the Docker host - change this if your Docker setup uses a different IP or hostname
      const response = await fetch('http://host.docker.internal:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({
          model: 'llama3:8b', // using the configured model name
          messages: [
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: userMessage }
          ],
          stream: false
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ollama API error:', response.status, errorText);
        throw new Error(`Failed to get response from Ollama (${response.status})`);
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: data.message?.content || "Sorry, I couldn't process your request."
      }]);
    } catch (error) {
      console.error('Error querying Ollama:', error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: "I'm having trouble connecting to my brain. Please check the Docker container is running and accessible."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 sm:w-96 overflow-hidden flex flex-col mb-4 border border-gray-200 dark:border-gray-700">
          <div className="bg-teal-500 dark:bg-teal-600 px-4 py-3 flex justify-between items-center">
            <h3 className="text-white font-medium">Skincare Assistant</h3>
            <button 
              onClick={toggleChat}
              className="text-white hover:bg-teal-600 dark:hover:bg-teal-700 rounded-full p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto max-h-96">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  } max-w-[80%]`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 mb-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-500 dark:text-gray-300">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <form onSubmit={sendMessage} className="border-t border-gray-200 dark:border-gray-700 p-2">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-teal-500 text-white py-2 px-4 rounded-r-lg hover:bg-teal-600 focus:outline-none disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-teal-500 hover:bg-teal-600 text-white rounded-full p-3 shadow-lg transition-transform hover:scale-110"
          aria-label="Open chat assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatbotIcon;
