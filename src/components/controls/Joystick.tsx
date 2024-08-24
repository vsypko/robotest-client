import { useEffect } from 'react'

import { movement } from '../../utils/movement'
import { useWebSocket } from '../../contexts/WebSocketContext'
import { useRobot } from '../../contexts/RobotContext'
import JoystickButton from './JoystickButton'
import { RobotType } from '../../utils/types'
import RobotPosition from './RobotPosition'

export default function Joystick() {
  const robot = useRobot()
  const socket = useWebSocket()

  //If the component did mount, then add the keypad event listener --------

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (socket && robot.name) {
        const { x, z, angle } = movement(e.key, robot.pose_x, robot.pose_z, robot.angle, robot.id)
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

    function handleKeyUp() {
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

  return (
    <div className="absolute w-full flex justify-center bottom-4 text-slate-200 text-4xl z-10">
      <div className="flex flex-col">
        <div className="text-slate-600 dark:text-slate-200 w-full items-start text-2xl p-2">
          <RobotPosition pose={'pose_x' as keyof RobotType} />
          <RobotPosition pose={'pose_z' as keyof RobotType} />
        </div>
        <div className="flex w-full justify-center">
          <JoystickButton keypressed="ArrowUp" icon="fas fa-circle-up" />
        </div>
        <div className="flex w-full justify-center items-center">
          <JoystickButton keypressed="ArrowLeft" icon="fas fa-circle-left" />

          {/* Orange color indicator 'power on' if socket opened ----------------- */}

          <span className={`text-5xl m-4 ${robot.id && socket ? 'text-orange-600' : 'text-emerald-500'} rounded-full`}>
            <i className="fas fa-wifi"></i>
          </span>
          {/* ------------------------------------------------------ */}

          <JoystickButton keypressed="ArrowRight" icon="fas fa-circle-right" />
        </div>
        <div className="flex w-full justify-center">
          <JoystickButton keypressed="ArrowDown" icon="fas fa-circle-down" />
        </div>
      </div>
    </div>
  )
}
