'use client';

import { useState, useRef, useEffect } from 'react';

const ChatbotIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hello! I\'m your skincare assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHealthy, setIsHealthy] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const chatEndRef = useRef(null);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1000);
    }
  };

  // Check chatbot health on component mount and when chat opens
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('/api/chatbot', {
          headers: authToken ? { 'Authorization': authToken } : {}
        });
        setIsHealthy(response.ok);
      } catch (error) {
        setIsHealthy(false);
      }
    };

    if (isOpen) {
      checkHealth();
    }
  }, [isOpen]);

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
    setIsTyping(true);
    
    try {
      // Get auth token for personalized recommendations
      const authToken = localStorage.getItem('authToken');
      
      // Call our Next.js API route which handles the Ollama communication
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': authToken })
        },
        body: JSON.stringify({
          message: userMessage,
          model: 'orca-mini:latest' // Using the smaller model for better performance
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Chatbot API error:', response.status, data);
        throw new Error(data.error || 'Failed to get response from chatbot');
      }
      
      // Simulate typing effect
      setTimeout(() => {
        setIsTyping(false);
        // Add AI response to chat
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: data.message || "Sorry, I couldn't process your request."
        }]);
      }, 1500);
    } catch (error) {
      console.error('Error querying chatbot:', error);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: "I'm having trouble connecting to my AI brain. Please make sure the Docker container is running. You can start it by running the 'start-chatbot.bat' file in the project folder."
        }]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render message content with basic formatting
  const renderMessageContent = (content) => {
    // Split content by lines and render with proper formatting
    const lines = content.split('\n');
    return (
      <div className="space-y-1 break-words overflow-wrap-anywhere">
        {lines.map((line, index) => {
          // Handle product and ingredient links first
          if (line.includes('[PRODUCT_LINK:') || line.includes('[INGREDIENT_LINK:')) {
            const parts = [];
            let processedLine = line;
            
            // Handle product links - using matchAll for better handling
            const productLinkRegex = /\[PRODUCT_LINK:([^\]]+)\](.*?)\[\/PRODUCT_LINK\]/g;
            const productMatches = [...line.matchAll(productLinkRegex)];
            
            // Handle ingredient links
            const ingredientLinkRegex = /\[INGREDIENT_LINK:([^\]]+)\](.*?)\[\/INGREDIENT_LINK\]/g;
            const ingredientMatches = [...line.matchAll(ingredientLinkRegex)];
            
            // Combine all matches and sort by position
            const allMatches = [
              ...productMatches.map(match => ({ ...match, type: 'product' })),
              ...ingredientMatches.map(match => ({ ...match, type: 'ingredient' }))
            ].sort((a, b) => a.index - b.index);
            
            let lastIndex = 0;
            
            allMatches.forEach((match, matchIndex) => {
              // Add text before the link
              if (match.index > lastIndex) {
                const beforeText = line.substring(lastIndex, match.index);
                if (beforeText.includes('**')) {
                  const boldParts = beforeText.split(/(\*\*.*?\*\*)/);
                  boldParts.forEach((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      parts.push(
                        <strong key={`${match.index}-before-${partIndex}`} className="font-semibold text-teal-600 dark:text-teal-300 break-words">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    } else if (part) {
                      parts.push(<span key={`${match.index}-text-${partIndex}`} className="break-words">{part}</span>);
                    }
                  });
                } else if (beforeText) {
                  parts.push(<span key={`${match.index}-before`} className="break-words">{beforeText}</span>);
                }
              }
              
              // Add the clickable link
              if (match.type === 'product') {
                parts.push(
                  <button
                    key={`product-${match.index}-${matchIndex}`}
                    onClick={() => {
                      if (match[1]) {
                        window.open(`/products/${match[1]}`, '_blank');
                      }
                    }}
                    className="font-semibold text-teal-600 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-100 underline cursor-pointer transition-colors duration-200 break-words"
                  >
                    {match[2] || 'Product'}
                  </button>
                );
              } else if (match.type === 'ingredient') {
                parts.push(
                  <button
                    key={`ingredient-${match.index}-${matchIndex}`}
                    onClick={() => {
                      if (match[1]) {
                        window.open(`/ingredients/${match[1]}`, '_blank');
                      }
                    }}
                    className="font-semibold text-teal-600 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-100 underline cursor-pointer transition-colors duration-200 break-words"
                  >
                    {match[2] || 'Ingredient'}
                  </button>
                );
              }
              
              lastIndex = match.index + match[0].length;
            });
            
            // Add remaining text
            if (lastIndex < line.length) {
              const remainingText = line.substring(lastIndex);
              if (remainingText.includes('**')) {
                const boldParts = remainingText.split(/(\*\*.*?\*\*)/);
                boldParts.forEach((part, partIndex) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    parts.push(
                      <strong key={`end-${partIndex}`} className="font-semibold text-teal-600 dark:text-teal-300 break-words">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  } else if (part) {
                    parts.push(<span key={`end-text-${partIndex}`} className="break-words">{part}</span>);
                  }
                });
              } else if (remainingText) {
                parts.push(<span key="end-remaining" className="break-words">{remainingText}</span>);
              }
            }
            
            return (
              <div key={index} className="leading-relaxed break-words">
                {parts}
              </div>
            );
          }
          
          // Handle bold text **text**
          if (line.includes('**')) {
            const parts = line.split(/(\*\*.*?\*\*)/);
            return (
              <div key={index} className="leading-relaxed break-words">
                {parts.map((part, partIndex) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                      <strong key={partIndex} className="font-semibold text-teal-600 dark:text-teal-300 break-words">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return <span key={partIndex} className="break-words">{part}</span>;
                })}
              </div>
            );
          }
          
          // Handle numbered lists
          if (line.match(/^\d+\./)) {
            return (
              <div key={index} className="ml-2 leading-relaxed break-words">
                <span className="font-medium text-teal-600 dark:text-teal-300">
                  {line.substring(0, line.indexOf('.') + 1)}
                </span>
                <span className="ml-1 break-words">{line.substring(line.indexOf('.') + 1)}</span>
              </div>
            );
          }
          
          // Handle bullet points with -
          if (line.trim().startsWith('- ')) {
            return (
              <div key={index} className="ml-4 leading-relaxed flex items-start">
                <span className="text-teal-500 mr-2 mt-1 text-xs flex-shrink-0">•</span>
                <span className="break-words">{line.substring(line.indexOf('- ') + 2)}</span>
              </div>
            );
          }
          
          // Handle links [text](url)
          if (line.includes('[') && line.includes('](')) {
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
            const parts = [];
            let lastIndex = 0;
            let match;
            
            while ((match = linkRegex.exec(line)) !== null) {
              // Add text before the link
              if (match.index > lastIndex) {
                parts.push(<span key={`before-${match.index}`} className="break-words">{line.substring(lastIndex, match.index)}</span>);
              }
              
              // Add the link
              parts.push(
                <a
                  key={match.index}
                  href={match[2]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline break-all"
                >
                  {match[1]}
                </a>
              );
              
              lastIndex = match.index + match[0].length;
            }
            
            // Add remaining text
            if (lastIndex < line.length) {
              parts.push(<span key="remaining" className="break-words">{line.substring(lastIndex)}</span>);
            }
            
            return (
              <div key={index} className="leading-relaxed break-words">
                {parts}
              </div>
            );
          }
          
          // Regular line
          return line.trim() ? (
            <div key={index} className="leading-relaxed break-words">
              {line}
            </div>
          ) : (
            <div key={index} className="h-2" /> // Empty line spacing
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating particles effect */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-teal-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}
      
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col mb-4 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in max-w-[calc(100vw-3rem)]">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 px-4 py-3 flex justify-between items-center relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
            </div>
            
            <div className="flex items-center space-x-3 relative z-10">
              {/* Animated AI avatar */}
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                {isHealthy && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>
              
              <div>
                <h3 className="text-white font-semibold text-sm">Skincare Assistant</h3>
                <div className="flex items-center space-x-1">
                  {isTyping ? (
                    <span className="text-white/80 text-xs">Thinking...</span>
                  ) : (
                    <span className="text-white/80 text-xs">Online</span>
                  )}
                  <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-300 animate-pulse' : 'bg-red-300'}`}></div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={toggleChat}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:scale-110 relative z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Chat messages area with custom scrollbar */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800 scrollbar-thin scrollbar-thumb-teal-300 scrollbar-track-gray-100 dark:scrollbar-thumb-teal-600 dark:scrollbar-track-gray-700">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 transform transition-all duration-300 ${msg.role === 'user' ? 'text-right animate-in slide-in-from-right-5' : 'animate-in slide-in-from-left-5'}`}>
                <div className={`inline-block p-3 rounded-2xl relative ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-200' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-shadow duration-200'
                  } max-w-[85%] group break-words overflow-hidden`}
                >
                  {msg.role === 'system' && (
                    <div className="absolute -left-2 top-3 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-white dark:border-r-gray-700"></div>
                  )}
                  {msg.role === 'user' && (
                    <div className="absolute -right-2 top-3 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-teal-500"></div>
                  )}
                  
                  <div className="relative z-10 chatbot-message">
                    {renderMessageContent(msg.content)}
                  </div>
                  
                  {/* Message time indicator */}
                  <div className={`text-xs mt-1 opacity-60 ${msg.role === 'user' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Enhanced typing indicator */}
            {(isLoading || isTyping) && (
              <div className="flex items-center space-x-2 mb-3 animate-in slide-in-from-left-5">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-md border border-gray-100 dark:border-gray-600 relative">
                  <div className="absolute -left-2 top-4 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-white dark:border-r-gray-700"></div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">AI is thinking</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          {/* Enhanced input form */}
          <form onSubmit={sendMessage} className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
            {/* Quick action buttons */}
            {messages.length <= 1 && (
              <div className="p-3 pb-0">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Try these recommendations:</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Recommend products for my skin type",
                    "What's best for my concerns?",
                    "I have oily skin with acne",
                    "Best moisturizer for dry skin",
                    "Help with dark spots",
                    "My skin looks dull",
                    "Products with vitamin C",
                    "What's good for sensitive skin?"
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setInput(prompt)}
                      className="text-xs bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-2 py-1 rounded-lg hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors duration-200"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex space-x-2 p-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about skincare..."
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-teal-300 dark:hover:border-teal-500"
                  disabled={isLoading}
                />
                {input && (
                  <button
                    type="button"
                    onClick={() => setInput('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-3 rounded-xl hover:from-teal-600 hover:to-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Enhanced floating action button */
        <div className="relative">
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 bg-teal-400 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-0 bg-teal-400 rounded-full animate-pulse opacity-30"></div>
          
          <button
            onClick={toggleChat}
            className="relative bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 hover:from-teal-600 hover:via-blue-600 hover:to-purple-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 group overflow-hidden"
            aria-label="Open chat assistant"
          >
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            
            {/* Main icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 relative z-10 group-hover:rotate-12 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatbotIcon;
