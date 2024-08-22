import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

import { useWebSocket } from '../../contexts/WebSocketContext'
import { useRobot, useRobotDispatch } from '../../contexts/RobotContext'

type GLTFResult = GLTF & {
  nodes: {
    Object_4: THREE.Mesh
    Object_6: THREE.Mesh
    Object_8: THREE.Mesh
    Object_9: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
    ['Material.001']: THREE.MeshStandardMaterial
    lentes: THREE.MeshStandardMaterial
    plastico: THREE.MeshStandardMaterial
  }
}

export default function BB8(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group | null>(null)
  const rotativObject = useRef<THREE.Group | null>(null)

  const { nodes, materials } = useGLTF('/bb8.glb') as GLTFResult

  const { socket } = useWebSocket()
  const robot = useRobot()
  const dispatch = useRobotDispatch()

  useEffect(() => {
    if (group.current && socket) {
      socket.onmessage = (msg) => {
        const { id, x, z, angle } = JSON.parse(msg.data)
        dispatch({ type: 'update', payload: { id, pose_x: x, pose_z: z, angle } })
      }
    }
  })

  useFrame(({ clock }) => {
    if (rotativObject.current && group.current) {
      if (group.current.position.z !== robot.pose_z) rotativObject.current.rotation.x = -clock.getElapsedTime() * 5
      if (group.current.position.x - robot.pose_x > 0) rotativObject.current.rotation.z = -clock.getElapsedTime() * 5
      if (group.current.position.x - robot.pose_x < 0) rotativObject.current.rotation.z = clock.getElapsedTime() * 5
      group.current.rotation.y = robot.angle
      rotativObject.current.rotation.y = robot.angle
      group.current.position.x = robot.pose_x
      group.current.position.z = robot.pose_z
    }
  })

  return (
    <group ref={group} {...props} dispose={null} scale={[0.8, 0.8, 0.8]} position={[0, 0.45, 0]}>
      <group name="root">
        <group name="GLTF_SceneRootNode">
          <group name="Cuerpo_1" ref={rotativObject}>
            <mesh
              name="Object_4"
              castShadow
              receiveShadow
              geometry={nodes.Object_4.geometry}
              material={materials.Material}
            />
          </group>
          <group name="Cabeza_3" rotation={[-Math.PI, 0.39, -Math.PI]}>
            <mesh
              name="Object_6"
              castShadow
              receiveShadow
              geometry={nodes.Object_6.geometry}
              material={materials['Material.001']}
            />
            <group name="opticos_2" position={[-0.194, 1.141, -0.468]} rotation={[2.639, -0.346, 2.957]}>
              <mesh
                name="Object_8"
                castShadow
                receiveShadow
                geometry={nodes.Object_8.geometry}
                material={materials.lentes}
              />
              <mesh
                name="Object_9"
                castShadow
                receiveShadow
                geometry={nodes.Object_9.geometry}
                material={materials.plastico}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/bb8.glb')
