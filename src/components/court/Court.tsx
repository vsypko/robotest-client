// import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import Field from './Field'
import { useRobots } from '../../contexts/RobotContext'
import Robot from '../robots/Robot'
import { Suspense } from 'react'

export default function Court() {
  const robots = useRobots()

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
      <Field />

      {robots &&
        robots.map((robot) => (
          <Suspense fallback={null} key={robot.id}>
            <Robot robot={robot.name} />
          </Suspense>
        ))}
    </Canvas>
  )
}
