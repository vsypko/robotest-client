type Another = {
  x: number
  z: number
}
export function movement(keycode: string, x: number, z: number, currentAngl: number, id: number, another?: Another) {
  let angle = currentAngl
  const border = id == 4 ? 18.08 : 18.64
  const step = id == 4 ? 0.15 : 0.1

  if (another) {
    if (x >= another.x) x += step
    if (x < another.x) x -= step
    if (z >= another.z) z += step
    if (z < another.z) z -= step

    return { x, z, angle }
  }

  switch (keycode) {
    case 'ArrowLeft':
      angle = Math.PI / 2
      if (x < -border) {
        x += step
        break
      }
      x -= step
      break

    case 'ArrowRight':
      angle = -Math.PI / 2
      if (x > border) {
        x -= step
        break
      }
      x += step
      break

    case 'ArrowUp':
      angle = 0
      if (z < -border) {
        z += step
        break
      }
      z -= step
      break

    case 'ArrowDown':
      angle = Math.PI
      if (z > border) {
        z -= step
        break
      }
      z += step
      break

    default:
      break
  }

  return { x, z, angle }
}
