'use client'

import VoiceBot from '@/components/VoiceBot'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Interview Voice Bot
            </h1>
            <p className="text-slate-600">
              AI-powered voice assistant for the 100x AI Agent Team position
            </p>
          </header>
          <VoiceBot />
        </div>
      </div>
    </main>
  )
}

