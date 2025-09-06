"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, User, Bot } from 'lucide-react';

const CareerGuidanceVoiceChat = () => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [isTTSSpeaking, setIsTTSSpeaking] = useState(false);
  const [apiKeys, setApiKeys] = useState({ gemini: '', heygen: '' });
  const [avatarVisible, setAvatarVisible] = useState(false);
  const [greetingSent, setGreetingSent] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const currentUtterance = useRef(null);
  const avatarTimeoutRef = useRef(null);

  // Initialize environment variables
  useEffect(() => {
    setApiKeys({
      gemini: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
      heygen: process.env.NEXT_PUBLIC_HEYGEN_API_KEY || ''
    });
  }, []);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // GUARANTEED Text-to-Speech function
  const speakWithTTS = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      
      // Choose best available voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      currentUtterance.current = utterance;
      setIsTTSSpeaking(true);
      
      utterance.onend = () => {
        setIsTTSSpeaking(false);
        currentUtterance.current = null;
      };
      
      utterance.onerror = () => {
        setIsTTSSpeaking(false);
        currentUtterance.current = null;
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Hybrid speaking function - Avatar with TTS fallback
  const speakText = (text) => {
    // ALWAYS use TTS for guaranteed audio
    speakWithTTS(text);
    
    // TRY avatar as bonus (but TTS ensures we always have voice)
    const avatarFrame = document.querySelector('#heygen-streaming-container iframe');
    if (avatarFrame && avatarFrame.contentWindow) {
      try {
        avatarFrame.contentWindow.postMessage({
          type: 'speak',
          text: text
        }, 'https://labs.heygen.com');
        
        setIsAvatarSpeaking(true);
        
        // Clear any existing timeout
        if (avatarTimeoutRef.current) {
          clearTimeout(avatarTimeoutRef.current);
        }
        
        // Set timeout for avatar speaking
        avatarTimeoutRef.current = setTimeout(() => {
          setIsAvatarSpeaking(false);
        }, Math.max(4000, text.length * 60));
        
      } catch (error) {
        console.error('Avatar error (TTS still working):', error);
      }
    }
  };

  // Send custom greeting when avatar loads
  useEffect(() => {
    if (avatarVisible && !greetingSent && apiKeys.gemini) {
      const timer = setTimeout(() => {
        const customGreeting = "Hi! I'm Wayne, your AI career counselor. I'm here to help you with career guidance, skill development, job opportunities, and professional growth. What can I help you with today?";
        
        setMessages([{
          type: 'ai',
          content: customGreeting,
          timestamp: new Date()
        }]);

        // Speak greeting (guaranteed audio via TTS)
        speakText(customGreeting);
        
        setGreetingSent(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [avatarVisible, greetingSent, apiKeys.gemini]);

  // Initialize HeyGen Interactive Avatar
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      !function(window){
        const host="https://labs.heygen.com",
        url=host+"/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJXYXluZV8yMDI0MDcxMSIsInByZXZpZXdJ%0D%0AbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3YzL2EzZmRiMGM2NTIwMjRmNzk5%0D%0AODRhYWVjMTFlYmYyNjk0XzM0MzUwL3ByZXZpZXdfdGFyZ2V0LndlYnAiLCJuZWVkUmVtb3ZlQmFj%0D%0Aa2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6ImRlbW8tMSIsInVzZXJuYW1lIjoiNjg0%0D%0AN2JjMGI0NzcxNGI2NGIxOTFlOGMwNDM3ZGE3MjkifQ%3D%3D&inIFrame=1",
        clientWidth=document.body.clientWidth,
        wrapDiv=document.createElement("div");
        
        wrapDiv.id="heygen-streaming-embed";
        const container=document.createElement("div");
        container.id="heygen-streaming-container";
        
        const stylesheet=document.createElement("style");
        stylesheet.innerHTML=\`
          #heygen-streaming-embed {
            z-index: 1;
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 12px;
            border: 2px solid #e5e7eb;
            box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
            overflow: hidden;
            opacity: 1;
            visibility: visible;
          }
          #heygen-streaming-container {
            width: 100%;
            height: 100%;
          }
          #heygen-streaming-container iframe {
            width: 100%;
            height: 100%;
            border: 0;
            border-radius: 12px;
          }
        \`;
        
        const iframe=document.createElement("iframe");
        iframe.allowFullscreen=true;
        iframe.title="Interactive Avatar";
        iframe.allow="microphone; camera";
        iframe.src=url;
        
        container.appendChild(iframe);
        wrapDiv.appendChild(stylesheet);
        wrapDiv.appendChild(container);
        
        const avatarContainer = document.getElementById('avatar-container');
        if(avatarContainer) {
          avatarContainer.appendChild(wrapDiv);
        }
      }(globalThis);
    `;
    
    const timer = setTimeout(() => {
      document.head.appendChild(script);
      setAvatarVisible(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      const existingEmbed = document.getElementById('heygen-streaming-embed');
      if (existingEmbed) {
        existingEmbed.remove();
      }
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Gemini AI Integration
  const callGeminiAPI = async (message) => {
    try {
      if (!apiKeys.gemini) {
        throw new Error('Gemini API key is not configured');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKeys.gemini}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Wayne, a professional AI career counselor. Provide helpful, personalized career advice. Be conversational, encouraging, and keep responses under 150 words. Always be supportive and professional. User question: ${message}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid API response structure');
      }

    } catch (error) {
      console.error('Gemini API error:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try asking your question again, and I'll do my best to help with your career goals.";
    }
  };

  const handleSendMessage = async (message = inputText) => {
    if (!message.trim()) return;
    
    if (!apiKeys.gemini) {
      const errorMsg = { 
        type: 'ai', 
        content: 'Please configure your Gemini API key to use this feature.', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMsg]);
      speakText(errorMsg.content);
      return;
    }
    
    // Add user message
    const userMessage = { type: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await callGeminiAPI(message);
      
      // Add AI message
      const aiMessage = { type: 'ai', content: aiResponse, timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);

      // GUARANTEED voice response (TTS + Avatar)
      speakText(aiResponse);
      
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        type: 'ai', 
        content: 'Sorry, I encountered an error. Please try again, and I\'ll help you with your career questions.', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
      speakText(errorMessage.content);
    } finally {
      setIsLoading(false);
    }
  };

  const stopSpeaking = () => {
    // Stop avatar
    const avatarFrame = document.querySelector('#heygen-streaming-container iframe');
    if (avatarFrame && avatarFrame.contentWindow) {
      avatarFrame.contentWindow.postMessage({ type: 'stop' }, 'https://labs.heygen.com');
    }
    
    // Clear avatar timeout
    if (avatarTimeoutRef.current) {
      clearTimeout(avatarTimeoutRef.current);
      avatarTimeoutRef.current = null;
    }
    
    // Stop TTS
    if (currentUtterance.current) {
      window.speechSynthesis.cancel();
      currentUtterance.current = null;
    }
    
    setIsAvatarSpeaking(false);
    setIsTTSSpeaking(false);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const isSpeaking = isAvatarSpeaking || isTTSSpeaking;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            AI Career Guidance Counselor
          </h1>
          <p className="text-gray-600 text-sm">
            Meet Wayne, your professional AI career counselor
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN - Interactive Avatar */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Wayne - Career Counselor</h2>
              {isSpeaking && (
                <div className="flex items-center text-green-600">
                  <Volume2 className="w-4 h-4 mr-1 animate-pulse" />
                  <span className="text-sm">Speaking</span>
                </div>
              )}
            </div>
            
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative mb-3">
              <div id="avatar-container" className="w-full h-full">
                {!avatarVisible && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Bot className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                      <p className="text-lg font-medium">Loading Wayne...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            {isSpeaking && (
              <div className="flex justify-center">
                <button
                  onClick={stopSpeaking}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                >
                  <VolumeX className="w-4 h-4 mr-2" />
                  Stop Speaking
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Chat Interface */}
          <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Career Consultation Chat</h2>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-96 min-h-96">
              {messages.length === 0 && !greetingSent && (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="w-10 h-10 mx-auto mb-2 text-gray-400 animate-pulse" />
                  <p className="text-sm">Wayne is getting ready...</p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`p-2 rounded-full ${
                      message.type === 'user' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {message.type === 'user' ? 'You' : 'Wayne'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="p-2 rounded-full bg-green-500">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="p-3 rounded-lg bg-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <div className="text-xs opacity-70 mt-1">Wayne is thinking...</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t pt-3">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                    placeholder="Ask Wayne about your career goals, skills, or opportunities..."
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputText.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-500 hover:text-blue-600 disabled:text-gray-400 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isLoading}
                  className={`p-3 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  } disabled:opacity-50`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidanceVoiceChat;
