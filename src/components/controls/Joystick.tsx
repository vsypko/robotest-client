import { useCallback, useEffect, useState } from 'react'
import { useMission } from '../../contexts/missionContext'
import { movement } from '../../utils/movement'
import { useWebSocket } from '../../contexts/WebSocketContext'

export default function Joystick() {
  const [isPointerDown, setIsPointerDown] = useState(false)
  const [keypressed, setKeypressed] = useState<string>('')
  const { mission, robot } = useMission()
  const { socket } = useWebSocket()

  //If the component did mount, then enable the socket event listener--------

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      e.preventDefault()
      if (socket) {
        const { x, z, angle } = movement(e.key, robot.pose_x, robot.pose_z, robot.angle)
        socket.send(
          JSON.stringify({
            method: 'reposition',
            id: robot.id,
            x,
            z,
            angle,
          })
        )
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      e.preventDefault()
      if (socket) {
        socket.send(
          JSON.stringify({
            method: 'reposition',
            id: robot.id,
            x: robot.pose_x,
            z: robot.pose_z,
            angle: robot.angle,
          })
        )
      }
    }

    window.addEventListener('keydown', handleKeyPress, true)
    window.addEventListener('keyup', handleKeyUp, true)

    return () => {
      window.removeEventListener('keydown', handleKeyPress, true)
      window.removeEventListener('keyup', handleKeyUp, true)
    }
  })
  //Function to fire relevant keypad event when pointer (mouse button) event is fired. -------------
  const triggerKeyEvent = useCallback((key: string, type: 'keydown' | 'keyup') => {
    const event = new KeyboardEvent(type, { key })
    document.body.dispatchEvent(event)
  }, [])
  //Pointer (mouse button) down event handler ----------------------------
  function handlePointerDown(key: string) {
    setIsPointerDown(true)
    setKeypressed(key)
    triggerKeyEvent(key, 'keydown')
  }
  //Pointer (mouse button) up event handler ----------------------------
  function handlePointerUp(key: string) {
    setIsPointerDown(false)
    triggerKeyEvent(key, 'keyup')
  }
  //Keypad events simulator in dependance on pointer (mouse button) event ----
  useEffect(() => {
    let interval: number | undefined

    if (isPointerDown) {
      interval = setInterval(() => {
        triggerKeyEvent(keypressed, 'keydown')
      }, 30)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPointerDown, keypressed, triggerKeyEvent])

  return (
    <div className="absolute w-full flex justify-center bottom-4 text-slate-200 text-4xl">
      <div className="block">
        <div className="flex w-full justify-center">
          <button
            onPointerDown={() => handlePointerDown('ArrowUp')}
            onPointerUp={() => handlePointerUp('ArrowUp')}
            onMouseLeave={() => {
              if (isPointerDown) handlePointerUp('ArrowUp')
            }}
            className="text-5xl text-emerald-500 rounded-full active:scale-90 active:text-emerald-400"
          >
            <i className="fas fa-circle-up"></i>
          </button>
        </div>
        <div className="flex w-full justify-center items-center">
          <button
            onPointerDown={() => handlePointerDown('ArrowLeft')}
            onPointerUp={() => handlePointerUp('ArrowLeft')}
            onMouseLeave={() => {
              if (isPointerDown) handlePointerUp('ArrowLeft')
            }}
            className="text-5xl text-emerald-500 rounded-full active:scale-90 active:text-emerald-400"
          >
            <i className="fas fa-circle-left"></i>
          </button>

          {/* Orange color button 'power on' if socket opened ----------------- */}

          <button
            className={`text-5xl m-4 ${
              mission.open ? 'text-orange-600' : 'text-emerald-500'
            } rounded-full active:scale-90 active:text-emerald-400`}
          >
            <i className="fas fa-power-off"></i>
          </button>

          <button
            onPointerDown={() => handlePointerDown('ArrowRight')}
            onPointerUp={() => handlePointerUp('ArrowRight')}
            onMouseLeave={() => {
              if (isPointerDown) handlePointerUp('ArrowRight')
            }}
            className="text-5xl text-emerald-500 rounded-full active:scale-90 active:text-emerald-400"
          >
            <i className="fas fa-circle-right"></i>
          </button>
        </div>
        <div className="flex w-full justify-center">
          <button
            onPointerDown={() => handlePointerDown('ArrowDown')}
            onPointerUp={() => handlePointerUp('ArrowDown')}
            onMouseLeave={() => {
              if (isPointerDown) handlePointerUp('ArrowDown')
            }}
            className="text-5xl text-emerald-500 rounded-full active:scale-90 active:text-emerald-400"
          >
            <i className="fas fa-circle-down"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
