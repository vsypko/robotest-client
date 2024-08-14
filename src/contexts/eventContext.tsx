import { createContext, useContext, useCallback, ReactNode } from 'react'

interface EventContextType {
  triggerKeyEvent: (key: string, type: 'keydown' | 'keyup') => void
}

const EventContext = createContext<EventContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useEventContext = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEventContext must be used within a EventProvider')
  }
  return context
}

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const triggerKeyEvent = useCallback((key: string, type: 'keydown' | 'keyup') => {
    const event = new KeyboardEvent(type, { key })
    document.body.dispatchEvent(event)
  }, [])

  return <EventContext.Provider value={{ triggerKeyEvent }}>{children}</EventContext.Provider>
}
