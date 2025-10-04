'use client'

import { useState } from 'react'
import VoiceBot from '@/components/VoiceBot'
import Image from 'next/image'

export default function Home() {
  const [showBot, setShowBot] = useState(false)

  const skills = [
    { name: 'AI/ML', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { name: 'Full Stack', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { name: 'Python', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { name: 'FastAPI', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'AWS Cloud', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
    { name: 'DevOps', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ]

  if (showBot) {
    return (
      <main className="min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Simple background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(148, 163, 184) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-4 relative z-10 h-screen flex flex-col">
          <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
            <header className="text-center mb-4 animate-fade-in-down flex-shrink-0">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-blue-900">
                  Interview Voice Bot
                </h1>
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Live
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Chat with Yash Tiwary's AI voice bot for the <span className="font-semibold text-blue-900">100x AI Agent Team</span> position
              </p>
            </header>
            <VoiceBot />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center">
      {/* Simple background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(148, 163, 184) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Image with Animation */}
          <div className="relative inline-block mb-10 animate-fade-in-down">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-900 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Image 
                src="/yash.jpeg" 
                alt="Yash Tiwary" 
                width={144} 
                height={144}
                className="object-cover"
              />
            </div>
          </div>

          {/* Skills Icons in Circles */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className="flex flex-col items-center"
                style={{
                  animation: `fade-in-up 0.5s ease-out ${0.1 + index * 0.15}s both`
                }}
              >
                <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 mb-2">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={skill.icon} />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-700">{skill.name}</span>
              </div>
            ))}
          </div>

          {/* Greeting Text */}
          <div className="mb-8 animate-fade-in-up" style={{animationDelay: '1s'}}>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-blue-900">
              Want to know about me?
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 font-medium mb-4">
              Let my AI assistant handle that.
            </p>
            <p className="text-base text-slate-600 max-w-2xl mx-auto italic">
              "I build production-ready AI solutions that scale. From RAG systems to multi-tenant platforms, I turn AI concepts into real business impact."
            </p>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in-up" style={{animationDelay: '1.2s'}}>
            <button
              onClick={() => setShowBot(true)}
              className="group px-10 py-4 bg-blue-900 hover:bg-blue-800 text-white text-lg font-bold rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span>Start Voice Interview</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            <p className="text-sm text-slate-500 mt-4">
              AI-powered voice chat ready
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '1.4s'}}>
            <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200">
              <div className="text-3xl font-bold text-blue-900">2+</div>
              <div className="text-xs text-slate-600 font-medium">Years AI Engineering</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200">
              <div className="text-3xl font-bold text-blue-900">12+</div>
              <div className="text-xs text-slate-600 font-medium">Production Systems</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200">
              <div className="text-3xl font-bold text-blue-900">15+</div>
              <div className="text-xs text-slate-600 font-medium">Technologies</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

