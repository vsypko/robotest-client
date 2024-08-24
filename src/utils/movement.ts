export function movement(keycode: string, x: number, z: number, currentAngl: number, id: number) {
  let dx = 0
  let dz = 0
  let angle = currentAngl
  const border = id == 4 ? 18.08 : 18.64
  const step = id == 4 ? 0.15 : 0.1

  switch (keycode) {
    case 'ArrowLeft':
      dx = -step
      dz = 0
      angle = Math.PI / 2
      if (x < -border) {
        x -= dx
        break
      }
      x += dx
      break
    case 'ArrowRight':
      dx = step
      dz = 0
      angle = -Math.PI / 2
      if (x > border) {
        x -= dx
        break
      }
      x += dx
      break
    case 'ArrowUp':
      dx = 0
      dz = -step
      angle = 0
      if (z < -border) {
        z -= dz
        break
      }
      z += dz
      break
    case 'ArrowDown':
      dx = 0
      dz = step
      angle = Math.PI
      if (z > border) {
        z -= dz
        break
      }
      z += dz
      break

    default:
      break
  }

  return { x, z, angle }
}
