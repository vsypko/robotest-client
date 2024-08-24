import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

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
      <group position={[0, 0, 0]} scale={20}>
        <mesh castShadow receiveShadow geometry={nodes.Cube_1.geometry} material={materials.Material} />
        <mesh castShadow receiveShadow geometry={nodes.Cube_2.geometry} material={materials['Material.001']} />
      </group>
    </group>
  )
}

useGLTF.preload('/field.glb')
