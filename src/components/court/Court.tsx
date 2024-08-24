import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import Field from './Field'
import SelectedRobot from '../robots/Robot'

export default function Court() {
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
      <Suspense fallback={null}>
        <SelectedRobot />
      </Suspense>
    </Canvas>
  )
}
