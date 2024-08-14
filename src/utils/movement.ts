export function movement(keycode: string, x: number, z: number): { x: number; z: number; angle: number } {
  let dx = 0
  let dz = 0
  let angle = 0
  const border = 18.64
  const step = 0.1

  switch (keycode) {
    case 'ArrowLeft':
      dx = -step
      dz = 0
      angle = Math.PI / 2
      break
    case 'ArrowRight':
      dx = step
      dz = 0
      angle = -Math.PI / 2
      break
    case 'ArrowUp':
      dx = 0
      dz = -step
      angle = 0
      break
    case 'ArrowDown':
      dx = 0
      dz = step
      angle = Math.PI
      break

    default:
      break
  }
  if (x <= border && x >= -border) {
    x += dx
  } else {
    x -= dx
  }
  if (z <= border && z >= -border) {
    z += dz
  } else {
    z -= dz
  }

  return { x, z, angle }
}
