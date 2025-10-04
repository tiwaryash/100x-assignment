'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const VoiceBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [textInput, setTextInput] = useState('')
  const [useTextInput, setUseTextInput] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get API URL from environment variable or use default
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const projects = [
    {
      title: "HTTP Server in Rust",
      description: "Personal project: Built a high-performance server handling 1,000+ concurrent requests with WebSocket support and plugin architecture",
      tech: "Rust, Async/Await, WebSocket, Observability",
      github: "github.com/tiwaryash",
      type: "Personal"
    },
    {
      title: "Nexus Mind AI Platform",
      description: "Personal project: RAG-based document intelligence system with 95% content extraction accuracy using LangChain, Cohere, and cloud-native backend",
      tech: "Python, LangChain, Cohere, FastAPI, PostgreSQL (pgvector), AWS S3, Redis",
      impact: "95% accuracy",
      type: "Personal"
    },
    {
      title: "Contract Management Platform (Work)",
      description: "At Thoucentric: Reduced contract review time by 65% and achieved 92% accuracy using Cohere AI and DeepSeek NLP models for clause extraction",
      tech: "Cohere AI, DeepSeek, React, Azure CI/CD",
      impact: "65% faster, 92% accuracy",
      type: "Professional"
    }
  ]

  const quickActions = [
    { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Resume', action: 'resume' },
    { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: 'Projects', action: 'projects' },
    { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Skills', action: 'skills' },
    { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Contact', action: 'contact' }
  ]

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
    }

    // Initialize speech recognition
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
      recognitionRef.current.maxAlternatives = 1

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscript || interimTranscript)

        if (finalTranscript) {
          handleUserMessage(finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        
        // Handle different error types
        if (event.error === 'network') {
          setError('Speech service temporarily unavailable. Try again or use text input below.')
          // Auto-retry once after a short delay for network errors
          setTimeout(() => {
            if (!isListening) {
              setError(null)
            }
          }, 2000)
        } else if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone permissions in browser settings.')
        } else if (event.error === 'no-speech') {
          setError(null) // Don't show error for no speech, just reset
        } else if (event.error === 'aborted') {
          setError(null) // User stopped it, no error needed
        } else {
          setError(`Speech recognition error: ${event.error}. Please use text input below.`)
        }
        
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    } else {
      setError('Speech recognition not supported in this browser. Please use Chrome.')
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError(null)
      setTranscript('')
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setShowQuickActions(false)
    
    switch (action) {
      case 'resume':
        // Show natural question instead of command
        const resumeMessage: Message = { role: 'user', content: 'Can I see your resume?' }
        setMessages(prev => [...prev, resumeMessage])
        handleCommand('/resume', true)  // Skip showing /resume command
        break
      case 'projects':
        const projectsMessage: Message = { role: 'user', content: 'What are your key projects?' }
        setMessages(prev => [...prev, projectsMessage])
        handleCommand('/projects', true)  // Skip showing /projects command
        break
      case 'skills':
        handleUserMessage('Tell me about your technical skills')
        break
      case 'contact':
        const contactMessage: Message = { role: 'user', content: 'How can I contact you?' }
        setMessages(prev => [...prev, contactMessage])
        handleCommand('/contact', true)  // Skip showing /contact command
        break
    }
  }

  const generateSuggestions = (lastMessage: string) => {
    const suggestions = [
      'What are your top achievements?',
      'Tell me about your experience with AI/ML',
      'What projects are you most proud of?',
      'How do you approach problem-solving?',
      'What makes you a good fit for 100x?'
    ]
    
    // Contextual suggestions based on conversation
    if (lastMessage.toLowerCase().includes('project')) {
      return ['Tell me more about your technical stack', 'What were the biggest challenges?', 'Can I see your resume?']
    } else if (lastMessage.toLowerCase().includes('skill')) {
      return ['What projects showcase these skills?', 'How do you stay updated?', 'Tell me about a complex problem you solved']
    }
    
    return suggestions.slice(0, 3)
  }

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return

    setShowQuickActions(false)

    // Handle special commands
    if (text.startsWith('/')) {
      handleCommand(text, false)
      return
    }

    const userMessage: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setTranscript('')
    setIsProcessing(true)

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        messages: [...messages, userMessage],
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response,
      }

      setMessages(prev => [...prev, assistantMessage])
      speakText(response.data.response)
      
      // Generate contextual suggestions
      setSuggestedQuestions(generateSuggestions(response.data.response))
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to get response from server. Please ensure the backend is running.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCommand = (command: string, skipUserMessage = false) => {
    if (!skipUserMessage) {
      const userMessage: Message = { role: 'user', content: command }
      setMessages(prev => [...prev, userMessage])
    }

    let response = ''
    
    if (command === '/resume') {
      response = "Here's my resume! You can download it using the button below.\n\nHighlights:\n• Software Engineer at Thoucentric\n• 65% faster contract reviews with AI\n• 100+ SaaS tenants scaled\n• 99.9% system uptime achieved\n\nWould you like to know more about any specific project or achievement?"
      
      // Add download button to messages
      const assistantMessage: Message = {
        role: 'assistant',
        content: response
      }
      setMessages(prev => [...prev, assistantMessage])
      
      // Add resume card
      const resumeCard: Message = {
        role: 'assistant',
        content: 'RESUME_CARD'
      }
      setMessages(prev => [...prev, resumeCard])
      
      setSuggestedQuestions(['Tell me about your AI/ML projects', 'What technologies do you specialize in?', 'How can I contact you?'])
    } else if (command === '/projects') {
      response = `Here are my key projects:\n\n${projects.map((p, i) => 
        `${i + 1}. ${p.title}\n   ${p.description}\n   Tech: ${p.tech}${p.impact ? `\n   Impact: ${p.impact}` : ''}${p.github ? `\n   GitHub: ${p.github}` : ''}`
      ).join('\n\n')}\n\nWant to dive deeper into any of these?`
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response
      }
      setMessages(prev => [...prev, assistantMessage])
      
      setSuggestedQuestions(['Tell me about the Rust HTTP server', 'What was the Nexus Mind platform about?', 'How did you achieve those results at work?'])
    } else if (command === '/contact') {
      response = "Let's connect!\n\nEmail: yash.r.tiwary@gmail.com\nLocation: Bengaluru, Karnataka\nLinkedIn: linkedin.com/in/yash-tiwary\nGitHub: github.com/tiwaryash\nWebsite: yashtiwary.com\n\nFeel free to reach out anytime!"
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response
      }
      setMessages(prev => [...prev, assistantMessage])
      
      setSuggestedQuestions(['Can I see your resume?', 'Tell me about your experience', 'What are you looking for in your next role?'])
    }
  }

  const speakText = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 1.0
      utterance.pitch = 1.0

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const clearConversation = () => {
    setMessages([])
    setTranscript('')
    setError(null)
    setSuggestedQuestions([])
    setShowQuickActions(true)
    stopSpeaking()
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-fade-in-up flex flex-col flex-1">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 backdrop-blur-sm">
        {messages.length === 0 ? (
          <div className="text-center mt-8 animate-fade-in-down">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 mx-auto bg-blue-900 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Ready to Start?</h3>
            <p className="text-sm text-slate-600 mb-4">Click the microphone or try a quick action</p>
            
            {/* Quick Action Buttons */}
            {showQuickActions && (
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-4">
                {quickActions.map((action) => (
                  <button
                    key={action.action}
                    onClick={() => handleQuickAction(action.action)}
                    className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-900 rounded-xl transition-all transform hover:scale-105 shadow-sm"
                  >
                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                    <span className="text-sm font-semibold text-slate-700">{action.label}</span>
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex flex-col items-center gap-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Voice recognition active
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } animate-fade-in-up`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200 shadow-lg">
                    <Image 
                      src="/yash.jpeg" 
                      alt="Yash" 
                      width={40} 
                      height={40}
                      className="object-cover"
                    />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-lg ${
                    message.role === 'user'
                      ? 'bg-blue-900 text-white rounded-br-sm'
                      : 'bg-white text-slate-800 rounded-bl-sm border border-slate-200'
                  }`}
                >
                  {message.content === 'RESUME_CARD' ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-900 font-semibold">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Yash Tiwary Resume</span>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <p>Software Engineer | AI/ML Specialist</p>
                        <p>Thoucentric - A Xoriant Company</p>
                      </div>
                      <a
                        href="/Yash_Tiwary_Resume.pdf"
                        download
                        className="flex items-center justify-center gap-2 w-full py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition-colors font-medium text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-3 justify-start animate-fade-in-up">
                <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200 shadow-lg relative">
                  <Image 
                    src="/yash.jpeg" 
                    alt="Yash" 
                    width={40} 
                    height={40}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-900/20 animate-pulse"></div>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl rounded-bl-sm shadow-lg border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-900 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-800 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-700 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-slate-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Suggested Questions */}
            {suggestedQuestions.length > 0 && !isProcessing && (
              <div className="flex flex-wrap gap-2 mt-4 animate-fade-in-up">
                <div className="w-full text-xs text-slate-500 mb-1">Suggested questions:</div>
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUserMessage(question)}
                    className="px-3 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-900 rounded-lg text-xs text-slate-700 transition-all transform hover:scale-105 shadow-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 animate-fade-in-down">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-blue-900 rounded-full animate-wave"></div>
              <div className="w-1 h-4 bg-blue-800 rounded-full animate-wave" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1 h-4 bg-blue-700 rounded-full animate-wave" style={{animationDelay: '0.2s'}}></div>
            </div>
            <p className="text-sm text-blue-900 flex-1">
              <span className="font-semibold">Listening:</span> <span className="font-medium">{transcript}</span>
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100 animate-fade-in-down">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 flex-1">{error}</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="p-4 bg-gradient-to-br from-white to-slate-50 border-t border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-center space-x-3">
          {/* Microphone Button */}
          <div className="relative">
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-red-400 animate-pulse-ring"></div>
                <div className="absolute inset-0 rounded-full bg-red-400 animate-pulse-ring" style={{animationDelay: '0.5s'}}></div>
              </>
            )}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing || isSpeaking}
              className={`relative p-5 rounded-full transition-all transform hover:scale-110 focus:outline-none focus:ring-4 shadow-xl ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
                  : 'bg-blue-900 hover:bg-blue-800 focus:ring-blue-300'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
          </div>

          {/* Stop Speaking Button */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-4 rounded-full bg-orange-600 hover:bg-orange-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-lg"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            </button>
          )}

          {/* Clear Button */}
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              disabled={isProcessing}
              className="p-4 rounded-full bg-slate-600 hover:bg-slate-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-slate-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Status Text */}
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-md border border-slate-200">
            {isListening ? (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-slate-700">Listening... Click to stop</p>
              </>
            ) : isSpeaking ? (
              <>
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-blue-900 rounded-full animate-wave"></div>
                  <div className="w-1 h-3 bg-blue-800 rounded-full animate-wave" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-3 bg-blue-700 rounded-full animate-wave" style={{animationDelay: '0.2s'}}></div>
                </div>
                <p className="text-sm font-medium text-slate-700">Speaking...</p>
              </>
            ) : isProcessing ? (
              <>
                <svg className="w-4 h-4 text-blue-900 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-sm font-medium text-slate-700">Processing...</p>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-sm font-medium text-slate-700">Ready - Click microphone or type below</p>
              </>
            )}
          </div>
        </div>

        {/* Text Input Alternative */}
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && textInput.trim()) {
                    handleUserMessage(textInput)
                    setTextInput('')
                  }
                }}
                placeholder="Type your question here..."
                disabled={isProcessing}
                className="w-full px-4 py-2.5 pr-10 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white shadow-sm text-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => {
                if (textInput.trim()) {
                  handleUserMessage(textInput)
                  setTextInput('')
                }
              }}
              disabled={isProcessing || !textInput.trim()}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-2">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Voice not working? Type above
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <span className="font-mono text-blue-900">/resume</span>
              <span className="font-mono text-blue-900">/projects</span>
              <span className="font-mono text-blue-900">/contact</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceBot

