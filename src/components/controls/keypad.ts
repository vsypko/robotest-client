import { movement } from '../../utils/movement'

export function keyControl(socket: WebSocket, id: number, currentX: number, currentZ: number, currentAngl: number) {
  function handleKeyPress(e: KeyboardEvent) {
    e.preventDefault()
    const { x, z, angle } = movement(e.key, currentX, currentZ, currentAngl)
    socket.send(
      JSON.stringify({
        method: 'reposition',
        id,
        x,
        z,
        angle,
      })
    )
  }

  function handleKeyUp(e: KeyboardEvent) {
    e.preventDefault()
    socket.send(
      JSON.stringify({
        method: 'reposition',
        id,
        x: currentX,
        z: currentZ,
        angle: currentAngl,
      })
    )
  }

  window.addEventListener('keydown', handleKeyPress, true)
  window.addEventListener('keyup', handleKeyUp, true)

  function controlOff() {
    window.removeEventListener('keydown', handleKeyPress, true)
    window.removeEventListener('keyup', handleKeyUp, true)
  }

  return controlOff
}
