import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import React, { useRef } from 'react';
import { Mesh, MeshStandardMaterial} from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Cube?: THREE.Mesh;
    lp_shuriken_e_0?: THREE.Mesh;
    Projectile2HP_map1_0?: THREE.Mesh;
  };
  materials: {
    Material?: THREE.MeshStandardMaterial;
    Shuriken_lp?: THREE.MeshStandardMaterial;
    map1?: THREE.MeshStandardMaterial;
  };
};

export const ModelFortyTwo = React.forwardRef((props: JSX.IntrinsicElements['mesh'], ref: React.Ref<THREE.Mesh>) => {

  const { nodes, materials } = useGLTF('./assets/42.gltf') as GLTFResult

  if (!nodes.Cube || !materials.Material) {
    return null;  // gerer lerreur
  }

  materials.Material.wireframe = true

  return (
    <mesh
      {...props}
      ref={ref}
      geometry={nodes.Cube.geometry}
      material={materials.Material}
      material-color="black" >
    </mesh>
  )
})

export const Shuriken = React.forwardRef((props: JSX.IntrinsicElements['mesh'], ref: React.Ref<THREE.Mesh>) => {
  const { nodes, materials } = useGLTF('./assets/shuriken.glb') as GLTFResult

  if (!nodes.lp_shuriken_e_0 || !materials.Shuriken_lp) {
    return null;  // gerer lerreur
  }

  materials.Shuriken_lp.wireframe = true

  return (
    <mesh
      {...props}
      ref={ref}
      geometry={nodes.lp_shuriken_e_0.geometry}
      material={materials.Shuriken_lp}
      rotation={[-Math.PI, 0, 0]} />
  )
})

export const Spiked_Ball = React.forwardRef((props: JSX.IntrinsicElements['mesh'], ref: React.Ref<THREE.Mesh>) => {

  const { nodes, materials } = useGLTF('./assets/spiked_ball.glb') as GLTFResult

  if (!nodes.Projectile2HP_map1_0 || !materials.map1) {
    return null;  // gerer lerreur
  }

  materials.map1.wireframe = true
  return (
    <mesh
      {...props}
      ref={ref}
      geometry={nodes.Projectile2HP_map1_0.geometry}
      material={materials.map1}
    />
  )
})