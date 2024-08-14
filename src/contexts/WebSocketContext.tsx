import { useContext, createContext, ReactNode, useEffect, useRef } from 'react'
import { useMission } from './missionContext'

type WebSocketContextType = {
  socket: WebSocket | null
}
const WebSocketContext = createContext<WebSocketContextType>({ socket: null })

// eslint-disable-next-line react-refresh/only-export-components
export const useWebSocket = () => useContext(WebSocketContext)

type WebSocketProviderProps = {
  url: string
  children: ReactNode
}

export const WebSocketProvider = ({ url, children }: WebSocketProviderProps) => {
  const { updateMissionStatus } = useMission()
  const socketRef = useRef<WebSocket | null>(null)

  if (!socketRef.current) {
    socketRef.current = new WebSocket(url)
  }

  const onOpen = () => {
    console.log('WebSocket connection is open')
    updateMissionStatus(true)
  }

  const onMessage = () => {}

  const onClose = () => {
    console.log('WebSocket connection is closed')
    updateMissionStatus(false)
  }

  useEffect(() => {
    const { current: socket } = socketRef

    if (!socket) return

    socket.addEventListener('open', onOpen)
    socket.addEventListener('message', onMessage)
    socket.addEventListener('close', onClose)

    return () => {
      socket.removeEventListener('open', onOpen)
      socket.removeEventListener('message', onMessage)
      socket.removeEventListener('close', onClose)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <WebSocketContext.Provider value={{ socket: socketRef.current }}>{children}</WebSocketContext.Provider>
}
