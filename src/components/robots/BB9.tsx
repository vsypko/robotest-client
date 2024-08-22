import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useRobot, useRobotDispatch } from '../../contexts/RobotContext'
import { useWebSocket } from '../../contexts/WebSocketContext'
import { useFrame } from '@react-three/fiber'

type GLTFResult = GLTF & {
  nodes: {
    ['Object002_01_-_Default_0_1']: THREE.Mesh
    ['Object002_01_-_Default_0_2']: THREE.Mesh
    ['Object002_01_-_Default_0_3']: THREE.Mesh
    ['Object002_01_-_Default_0_4']: THREE.Mesh
    ['Object002_01_-_Default_0_5']: THREE.Mesh
    ['Sphere001_03_-_Default_0_1']: THREE.Mesh
    ['Sphere001_03_-_Default_0_2']: THREE.Mesh
    ['Sphere001_03_-_Default_0_3']: THREE.Mesh
  }
  materials: {
    ['01_-_Default']: THREE.MeshStandardMaterial
    ['07_-_Default']: THREE.MeshStandardMaterial
    ['02_-_Default']: THREE.MeshStandardMaterial
    ['03_-_Default']: THREE.MeshStandardMaterial
    ['08_-_Default']: THREE.MeshStandardMaterial
  }
}

export default function BB9(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group | null>(null)
  const rotative = useRef<THREE.Group | null>(null)
  const { nodes, materials } = useGLTF('/bb9.glb') as GLTFResult

  const { socket } = useWebSocket()
  const robot = useRobot()
  const dispatch = useRobotDispatch()

  useEffect(() => {
    if (group.current && rotative.current && socket) {
      socket.onmessage = (msg) => {
        const { id, x, z, angle } = JSON.parse(msg.data)
        dispatch({ type: 'update', payload: { id, pose_x: x, pose_z: z, angle } })
      }
    }
  })

  useFrame(({ clock }) => {
    if (rotative.current && group.current) {
      if (group.current.position.z !== robot.pose_z) rotative.current.rotation.x = -clock.getElapsedTime() * 3
      if (group.current.position.x - robot.pose_x > 0) rotative.current.rotation.z = -clock.getElapsedTime() * 3
      if (group.current.position.x - robot.pose_x < 0) rotative.current.rotation.z = clock.getElapsedTime() * 3
      group.current.rotation.y = robot.angle
      rotative.current.rotation.y = robot.angle
      group.current.position.x = robot.pose_x
      group.current.position.z = robot.pose_z
    }
  })

  return (
    <group {...props} dispose={null} ref={group} position={[0, -0.6, 0]}>
      <group>
        <group>
          <group position={[0, 3.228, 0]} rotation={[-Math.PI / 2, 0, Math.PI]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes['Object002_01_-_Default_0_1'].geometry}
              material={materials['01_-_Default']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes['Object002_01_-_Default_0_2'].geometry}
              material={materials['07_-_Default']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes['Object002_01_-_Default_0_3'].geometry}
              material={materials['02_-_Default']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes['Object002_01_-_Default_0_4'].geometry}
              material={materials['03_-_Default']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes['Object002_01_-_Default_0_5'].geometry}
              material={materials['08_-_Default']}
            />
          </group>
          <group position={[0, 1.674, 0]} ref={rotative}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes['Sphere001_03_-_Default_0_1'].geometry}
              material={materials['03_-_Default']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes['Sphere001_03_-_Default_0_2'].geometry}
              material={materials['01_-_Default']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes['Sphere001_03_-_Default_0_3'].geometry}
              material={materials['02_-_Default']}
            />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/bb9.glb')
