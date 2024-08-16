import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useFrame } from '@react-three/fiber'
import { useMission } from '../../contexts/missionContext'
import { useWebSocket } from '../../contexts/WebSocketContext'

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh
  }
  materials: {
    R2D2Tex: THREE.MeshStandardMaterial
  }
}

export default function R2D2(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/r2d2.glb') as GLTFResult
  const group = useRef<THREE.Group | null>(null)

  const { socket } = useWebSocket()
  const { robot, updatePosition } = useMission()

  useEffect(() => {
    if (group.current && socket) {
      socket.onmessage = (msg) => {
        const { id, x, z, angle } = JSON.parse(msg.data)
        updatePosition(id, x, z, angle)
      }
    }
  })

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = robot.angle
      group.current.position.z = robot.pose_z
      group.current.position.x = robot.pose_x
    }
  })

  return (
    <group {...props} dispose={null} ref={group} scale={[4, 4, 4]} position={[0, -0.55, 0]}>
      <mesh castShadow receiveShadow geometry={nodes.Object_2.geometry} material={materials.R2D2Tex} />
    </group>
  )
}

useGLTF.preload('/r2d2.glb')
