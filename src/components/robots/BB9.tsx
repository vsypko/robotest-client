import * as THREE from 'three'
import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useRobots } from '../../contexts/RobotContext'
import { useFrame } from '@react-three/fiber'
import { CollisionTarget, RapierRigidBody, RigidBody } from '@react-three/rapier'
import { movement } from '../../utils/movement'
import { useWebSocket } from '../../contexts/WebSocketContext'

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

const TOLERANCE = 0.01

const isCloseToZero = (value: number): boolean => {
  return Math.abs(value) < TOLERANCE
}

export default function BB9() {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const rotative = useRef<THREE.Group | null>(null)
  const { nodes, materials } = useGLTF('/bb9.glb') as GLTFResult

  //get robot data from context and rerender ---------------------------------
  const robot = useRobots().find((robot) => Number(robot.id) === 4)
  const socket = useWebSocket()

  const handleCollisionEnter = (other: CollisionTarget) => {
    if (!rigidBodyRef.current || !robot || !socket || !other.rigidBodyObject) return
    rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    rigidBodyRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true)
    rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    rigidBodyRef.current.setTranslation({ x: 0, y: 0, z: 0 }, true)

    const position = other.rigidBodyObject.position

    const { x, z, angle } = movement('collision', robot.pose_x, robot.pose_z, robot.angle, robot.id, {
      x: position.x,
      z: position.z,
    })
    socket.send(
      JSON.stringify({
        method: 'reposition',
        id: robot.id,
        pose_x: x,
        pose_z: z,
        angle,
      })
    )
  }

  useFrame(({ clock }) => {
    if (!rotative.current || !rigidBodyRef.current || !robot) return

    const currentPosition = rigidBodyRef.current.translation()
    const dx = currentPosition.x - robot.pose_x
    const dz = currentPosition.z - robot.pose_z

    if (!isCloseToZero(dz)) rotative.current.rotation.x = -clock.getElapsedTime() * 4
    if (!isCloseToZero(dx)) {
      if (currentPosition.x - robot.pose_x > 0) rotative.current.rotation.z = -clock.getElapsedTime() * 4
      if (currentPosition.x - robot.pose_x < 0) rotative.current.rotation.z = clock.getElapsedTime() * 4
    }

    const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, robot.angle, 0))
    rigidBodyRef.current.setRotation(quaternion, true)
    if (!isCloseToZero(dz) || !isCloseToZero(dx)) rotative.current.rotation.y = robot.angle
    rigidBodyRef.current.setTranslation({ x: robot.pose_x, y: 0, z: robot.pose_z }, true)
  })

  return (
    <group>
      <RigidBody ref={rigidBodyRef} colliders="hull" onCollisionEnter={({ other }) => handleCollisionEnter(other)}>
        <group dispose={null} position={[0, -0.6, 0]}>
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
      </RigidBody>
    </group>
  )
}

useGLTF.preload('/bb9.glb')
