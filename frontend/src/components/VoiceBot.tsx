'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

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
  
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get API URL from environment variable or use default
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
    }

    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

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
        setError(`Recognition error: ${event.error}`)
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

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return

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
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to get response from server. Please ensure the backend is running.')
    } finally {
      setIsProcessing(false)
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
    stopSpeaking()
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 mt-20">
            <svg
              className="w-16 h-16 mx-auto mb-4"
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
            <p className="text-lg">Click the microphone to start the interview</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-slate-800 shadow'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl shadow">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="px-6 py-3 bg-primary-50 border-t border-primary-100">
          <p className="text-sm text-primary-700">
            <span className="font-medium">Listening:</span> {transcript}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-t border-red-100">
          <p className="text-sm text-red-700">
            <span className="font-medium">Error:</span> {error}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="p-6 bg-white border-t border-slate-200">
        <div className="flex items-center justify-center space-x-4">
          {/* Microphone Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || isSpeaking}
            className={`p-6 rounded-full transition-all transform hover:scale-105 focus:outline-none focus:ring-4 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300 animate-pulse'
                : 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg
              className="w-8 h-8 text-white"
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

          {/* Stop Speaking Button */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-4 rounded-full bg-slate-500 hover:bg-slate-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300"
            >
              <svg
                className="w-6 h-6 text-white"
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
              className="p-4 rounded-full bg-slate-200 hover:bg-slate-300 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-6 h-6 text-slate-700"
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
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600">
            {isListening
              ? 'Listening... Click to stop'
              : isSpeaking
              ? 'Speaking...'
              : isProcessing
              ? 'Processing...'
              : 'Click the microphone to ask a question'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default VoiceBot

