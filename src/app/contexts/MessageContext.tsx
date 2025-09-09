'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

type MessageType = 'success' | 'error' | 'info' | 'warning'

interface MessageState {
  id: number
  type: MessageType
  text: string
}

interface MessageContextValue {
  showMessage: (text: string, type?: MessageType) => void
  clearMessage: (id: number) => void
  messages: MessageState[]
}

const MessageContext = createContext<MessageContextValue | undefined>(undefined)

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<MessageState[]>([])

  const showMessage = useCallback((text: string, type: MessageType = 'info') => {
    setMessages(prev => {
      const id = (prev[prev.length - 1]?.id ?? 0) + 1
      return [...prev, { id, type, text }]
    })
  }, [])

  const clearMessage = useCallback((id: number) => {
    setMessages(prev => prev.filter(m => m.id !== id))
  }, [])

  const value = useMemo(() => ({ showMessage, clearMessage, messages }), [showMessage, clearMessage, messages])

  return (
    <MessageContext.Provider value={value}>
      {children}
      <div className="fixed top-20 inset-x-0 z-50 flex flex-col items-center gap-2 px-4">
        {messages.map(m => (
          <div
            key={m.id}
            className={`max-w-lg w-full rounded-xl shadow-lg border px-4 py-3 text-sm backdrop-blur bg-white/90 ${
              m.type === 'success' ? 'border-green-300 text-green-800' :
              m.type === 'error' ? 'border-red-300 text-red-800' :
              m.type === 'warning' ? 'border-yellow-300 text-yellow-800' :
              'border-blue-300 text-blue-800'
            }`}
            onClick={() => clearMessage(m.id)}
            role="alert"
          >
            {m.text}
          </div>
        ))}
      </div>
    </MessageContext.Provider>
  )
}

export function useMessage() {
  const ctx = useContext(MessageContext)
  if (!ctx) throw new Error('useMessage must be used within MessageProvider')
  return ctx
}


