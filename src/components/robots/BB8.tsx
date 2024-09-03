import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

import { useRobots } from '../../contexts/RobotContext'
import { RapierRigidBody, RigidBody } from '@react-three/rapier'

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

const TOLERANCE = 1e-3

const isCloseToZero = (value: number): boolean => {
  return Math.abs(value) < TOLERANCE
}

export default function BB8() {
  //get robot data from context and rerender ---------------------------------
  const robot = useRobots().find((robot) => Number(robot.id) === 2)

  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const rotativObject = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF('/bb8.glb') as GLTFResult

  useFrame(({ clock }) => {
    if (!rotativObject.current || !rigidBodyRef.current || !robot) return
    const currentPosition = rigidBodyRef.current.translation()

    const dx = currentPosition.x - robot.pose_x
    const dz = currentPosition.z - robot.pose_z

    if (!isCloseToZero(dz)) rotativObject.current.rotation.x = -clock.getElapsedTime() * 5
    if (!isCloseToZero(dx)) {
      if (currentPosition.x - robot.pose_x > 0) rotativObject.current.rotation.z = -clock.getElapsedTime() * 5
      if (currentPosition.x - robot.pose_x < 0) rotativObject.current.rotation.z = clock.getElapsedTime() * 5
    }

    const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, robot.angle, 0))
    rigidBodyRef.current.setRotation(quaternion, true)
    rotativObject.current.rotation.y = robot.angle
    rigidBodyRef.current.setTranslation({ x: robot.pose_x, y: 0, z: robot.pose_z }, true)
  })

  const handleCollisionEnter = () => {
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    }
  }

  return (
    <RigidBody ref={rigidBodyRef} type="dynamic" colliders="cuboid" onCollisionEnter={handleCollisionEnter}>
      <group dispose={null} scale={[0.8, 0.8, 0.8]} position={[0, 0.45, 0]}>
        <group name="root" dispose={null}>
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
    </RigidBody>
  )
}

useGLTF.preload('/bb8.glb')
