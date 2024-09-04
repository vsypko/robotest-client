import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { RigidBody } from '@react-three/rapier'

type GLTFResult = GLTF & {
  nodes: {
    Cube_1: THREE.Mesh
    Cube_2: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
    ['Material.001']: THREE.MeshStandardMaterial
  }
}

export default function Field(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/field.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group scale={20}>
        <mesh castShadow receiveShadow geometry={nodes.Cube_1.geometry} material={materials.Material} />
        <RigidBody type="fixed" restitution={0} colliders={false}>
          <mesh castShadow receiveShadow geometry={nodes.Cube_2.geometry} material={materials['Material.001']} />
        </RigidBody>
      </group>
    </group>
  )
}

useGLTF.preload('/field.glb')
