import * as THREE from 'three'
import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useFrame } from '@react-three/fiber'
import { useRobot } from '../../contexts/RobotContext'

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

  //get robot data from context and rerender ---------------------------------
  const robot = useRobot()

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = robot.angle
      group.current.position.z = robot.pose_z
      group.current.position.x = robot.pose_x
    }
  })

  return (
    <group {...props} dispose={null} ref={group} scale={[4, 4, 4]} position={[0, -0.55, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_2.geometry}
        material={materials.R2D2Tex}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  )
}

useGLTF.preload('/r2d2.glb')
