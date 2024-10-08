import { useContext, createContext, ReactNode, useEffect, useRef } from 'react'
import { useRobotsDispatch } from './RobotContext'

const WebSocketContext = createContext<WebSocket | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useWebSocket = () => useContext(WebSocketContext)

type WebSocketProviderProps = {
  url: string
  children: ReactNode
}

export const WebSocketProvider = ({ url, children }: WebSocketProviderProps) => {
  const socketRef = useRef<WebSocket | null>(null)
  const dispatch = useRobotsDispatch()

  if (!socketRef.current) {
    socketRef.current = new WebSocket(url)
  }

  const onOpen = () => {
    console.log('WebSocket connection is open')
  }

  const onMessage = (msg: MessageEvent) => {
    const { method, id, pose_x, pose_z, angle } = JSON.parse(msg.data)
    if (method === 'newposition') dispatch({ type: 'update', payload: { id, pose_x, pose_z, angle } })
  }

  const onClose = () => {
    console.log('WebSocket connection is closed')
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
  })

  return <WebSocketContext.Provider value={socketRef.current}>{children}</WebSocketContext.Provider>
}
