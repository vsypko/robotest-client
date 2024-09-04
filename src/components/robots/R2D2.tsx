import * as THREE from 'three'
import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useFrame } from '@react-three/fiber'
import { useRobots } from '../../contexts/RobotContext'
import { CollisionTarget, RapierRigidBody, RigidBody } from '@react-three/rapier'
import { movement } from '../../utils/movement'
import { useWebSocket } from '../../contexts/WebSocketContext'

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh
  }
  materials: {
    R2D2Tex: THREE.MeshStandardMaterial
  }
}

export default function R2D2() {
  const { nodes, materials } = useGLTF('/r2d2.glb') as GLTFResult
  const rigidBodyRef = useRef<RapierRigidBody | null>(null)

  //get robot data from context and rerender ---------------------------------
  const robot = useRobots().find((robot) => Number(robot.id) === 1)
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
        x,
        z,
        angle,
      })
    )
  }

  useFrame(() => {
    if (rigidBodyRef.current && robot) {
      const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, robot.angle, 0))
      rigidBodyRef.current.setRotation(quaternion, true)
      rigidBodyRef.current.setTranslation({ x: robot.pose_x, y: 0, z: robot.pose_z }, true)
    }
  })

  return (
    <group>
      <RigidBody ref={rigidBodyRef} colliders="hull" onCollisionEnter={({ other }) => handleCollisionEnter(other)}>
        <group dispose={null} scale={[4, 4, 4]} position={[0, -0.55, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_2.geometry}
            material={materials.R2D2Tex}
            rotation={[0, Math.PI, 0]}
          />
        </group>
      </RigidBody>
    </group>
  )
}

useGLTF.preload('/r2d2.glb')
