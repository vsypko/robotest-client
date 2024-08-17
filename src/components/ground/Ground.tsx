import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BB8 from '../robots/BB8'
import R2D2 from '../robots/R2D2'

import { Field } from './Field'
import { useRobot } from '../../contexts/RobotContext'

function Robot() {
  const robot = useRobot()
  let Robot: JSX.Element | null = null
  switch (robot.name) {
    case 'R2D2':
      Robot = <R2D2 />
      break
    case 'BB8':
      Robot = <BB8 />
      break
    default:
      Robot = null
      break
  }
  return Robot
}

export default function Ground() {
  return (
    <Canvas
      shadows
      camera={{ fov: 45, near: 0.01, far: 10000, position: [0, 15, 50] }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <OrbitControls />
      <ambientLight intensity={2} />
      <directionalLight castShadow position={[40, 70, 30]} shadow-mapSize={[1024, 1024]} intensity={2}>
        <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50, 0.01, 10000]} />
      </directionalLight>

      <Suspense fallback={null}>
        <Field />
        <Robot />
      </Suspense>
    </Canvas>
  )
}
