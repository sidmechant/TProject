import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { GLTFResult, PropsJsxBall } from '../../types/Map'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGame } from '../../store/hooks/useGame'
import FlameShader from './FlamShader'
import WindShader from './WindShader'
import chroma from 'chroma-js'
import { set } from 'math/vec2'

type GLTFResultRetroBall = GLTF & {
  nodes: {
    model_1: THREE.Mesh
  }
  materials: {
    ['Material.014']: THREE.MeshStandardMaterial
  }
}

export function NinjaBall({ body, position, velocity, color1, color2 }: PropsJsxBall & { color1?: string | undefined, color2?: string | undefined }) {
  const { nodes, materials } = useGLTF('./assets/balls&paddles/Balls&Paddles.glb') as GLTFResult;
  const currentRotation = useRef(0);
  const refGrp = useRef<THREE.Group>(null);
  const refShaders = useRef<THREE.Group>(null);
  const refMsh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (refGrp.current) {

      const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
      currentRotation.current += speed * 0.01;

      refGrp.current.rotation.z = currentRotation.current * 5;
      // position.y += Math.sin(posiation.y) * Math.random() * 0.1;

    }
    if (body.current) {
      body.current.position.set(position.x, position.y, position.z);
      body.current.rotation.x = Math.sin(position.y) * 0.3;
    }
    if (refShaders.current) {
      const angle = Math.atan2(-velocity.y, velocity.x);
      refShaders.current.rotation.z = -(angle + Math.PI / 2);
    }
  });


  return (
    <>
      <group ref={body} position={[0, 0, 0]} scale={[1.2,1.2,1.2]}>
        <group ref={refShaders}>
          <FlameShader position={[0, -0.455, -0.008]} scale={[0.5, 0.15, 0.05]} rotation={[0, 0, 0]} color1={hexToRgb("#ff123e")} />
          <FlameShader position={[0, -0.455, -0.01]} scale={[0.55, 0.15, 0.04]} rotation={[0, 0, 0]} color1={hexToRgb("#070505")} />
          <FlameShader position={[0, -0.455, -0.01]} scale={[0.1, 0.18, 0.05]} rotation={[0, 0, 0]} color1={hexToRgb("#128dff")} />
          <FlameShader position={[0, -0.455, -0.01]} scale={[0.12, 0.18, 0.05]} rotation={[0, 0, 0]} color1={hexToRgb("#000000")} />

          {/* <WindShader position={[0, -1, 0]} scale={[0.45, 0.5, 0.3]} rotation={[0, Math.PI, 0]} color1={hexToRgb("#000000")} /> */}
          {/* <WindShader position={[0.2, -0.5, -0.1]} scale={[0.045, 0.2, 0.003]} rotation={[0, Math.PI, -0.30]} color1={hexToRgb("#ffffff")} /> */}
          {/* <WindShader position={[-0.2, -0.5, -0.1]} scale={[0.045, 0.2, 0.003]} rotation={[0, Math.PI, 0.3]} color1={hexToRgb("#ffffff")} /> */}
          {/* <WindShader position={[0, -1, -0.1]} scale={[0.045, 0.2, 0.003]} rotation={[0, Math.PI, 0]} color1={hexToRgb("#ffffff")} /> */}
        </group>
        <group ref={refGrp} scale={[0.00006, 0.00006, 0.00009]} dispose={null}>
          <mesh ref={refMsh} geometry={nodes.Shuriken.geometry} material={materials.Material__25} rotation={[Math.PI / 2, 0, 0]} castShadow/>
          <group>
            <mesh geometry={nodes.Shuriken_Lame02.geometry} material={materials.Material__25} rotation={[Math.PI / 2, Math.PI / 2, 0]} castShadow/>
            <mesh geometry={nodes.Shuriken_Lame02.geometry} material={materials.Material__25} rotation={[Math.PI / 2, -Math.PI / 2, 0]} castShadow/>
            <mesh geometry={nodes.Shuriken_Lame02.geometry} material={materials.Material__25} rotation={[Math.PI / 2, Math.PI, 0]} castShadow/>
            <mesh geometry={nodes.Shuriken_Lame02.geometry} material={materials.Material__25} rotation={[Math.PI / 2, 0, 0]} castShadow/>
          </group>
        </group>
      </group>
    </>
  )
}

export function MedievalBall({ body, position, velocity }: PropsJsxBall) {
  const { nodes, materials } = useGLTF('./assets/balls&paddles/Balls&Paddles.glb') as GLTFResult;
  const currentRotation = useRef(0);

  useFrame(() => {
    if (body.current) {
      const angle = Math.atan2(velocity.y, velocity.x);
      const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
      currentRotation.current += speed * 0.01;

      body.current.rotation.y += (currentRotation.current * 3 - body.current.rotation.y) * 0.1;
      body.current.rotation.x = angle * 3;
      body.current.position.set(position.x, position.y, position.z);
    }
  });

  return (
    <>
      <group ref={body} position={[0, 0, 0]} scale={0.0001} dispose={null}>
        <mesh geometry={nodes.Balle.geometry} material={materials.Material__25} position={[-26.216, -7.471, 1.845]} castShadow/>
        <mesh geometry={nodes.Balle_Pique.geometry} material={materials.Material__25} position={[-26.216, -7.471, 1.845]} castShadow/>
      </group>
    </>
  )
}

export function DesertBall({ body, position, velocity }: PropsJsxBall) {
  const { nodes, materials } = useGLTF('./assets/balls&paddles/Balls&Paddles.glb') as GLTFResult;
  const flowerRef = useRef<THREE.Mesh>(null)
  const currentRotation = useRef(0);

  useFrame(() => {

    if (body.current && flowerRef.current) {
      const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
      currentRotation.current += speed * 0.01;
      const time = Date.now();

      position.y += Math.cos(time * 0.001) * 0.1;
      position.z += -Math.abs(Math.sin(time * 0.001)) * 0.1;
      flowerRef.current.rotation.z = time * 0.02 + currentRotation.current;
      body.current.rotation.x = Math.sin(time * 0.001) * 0.2
      body.current.rotation.y += (velocity.x * 0.04 - body.current.rotation.y) * 0.1;
      body.current.rotation.z = time * 0.0005 + currentRotation.current;
      body.current.position.set(position.x, position.y, position.z);
    }
  });

  return (
    <>
      <group ref={body}>
        <group rotation={[0, 0, 0]} dispose={null}>
          <mesh geometry={nodes.Cactus.geometry} material={materials.Material__25} scale={0.000127} castShadow/>
          <mesh ref={flowerRef} geometry={nodes.Cactus_Fleur.geometry} material={materials.Material__25} scale={0.000127} position={[0, 0, 0.13]} castShadow/>
        </group>
      </group>
    </>
  )
}

const hexToRgb = (hex: string | undefined): [number, number, number] | undefined => {
  // Retirer le caractère "#" si présent
  if (hex === undefined) return undefined;
  hex = hex.replace(/^#/, '');

  // Convertir les valeurs hexadécimales en valeurs entières
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return [r, g, b];
};

export function RetroBall({ body, position, velocity }: PropsJsxBall & { color?: string | undefined }) {
  const { nodes, materials } = useGLTF('./assets/balls&paddles/retroBall.glb') as GLTFResultRetroBall
  // const { context } = useGame();
  const currentRotation = useRef(0);
  const chromaScale = chroma.scale(['#29232c', '#b66638', '#46424e','#b66638', '#29232c']);
  const [isMoving, setIsMoving] = useState(false);
  const [colorSkull, setColor] = useState('#991b1b');
  let t = useRef(0);

  useFrame(() => {
    if (body.current) {
      const angle = Math.atan2(velocity.y, velocity.x);
      const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
      const time = Date.now();
      currentRotation.current += speed * 0.01;

      position.z = Math.sin(time * 0.005) * 0.1;
      body.current.rotation.y = angle + Math.PI / 2;
      body.current.position.set(position.x, position.y, position.z);
      if (speed > 0.1) {
        setIsMoving(true);
      } else {
        setIsMoving(false);
      }
      if (isMoving) {
        t.current = (t.current + 0.005) % 1;// Change 0.01 pour ajuster la vitesse de la transition
        const newColor = chromaScale(t.current).hex();
        setColor(newColor);
      }
    }

    // if (refMsh.current) { <==========invisibilite
    //   const material = refMsh.current.material as THREE.MeshStandardMaterial; // Ajustez le type en fonction du matériau que vous utilisez

    //   // Modifier l'opacité
    //   material.opacity = (material.opacity + delta * 0.1) % 1; // Définissez cela à n'importe quelle valeur entre 0 et 1
    //   console.log(material.opacity)
    //   // N'oubliez pas de régler la transparence à true
    //   material.transparent = true;

    //   // Assurez-vous de mettre à jour le matériau
    //   material.needsUpdate = true;
    // }

  });
  return (
    <group ref={body}
      rotation={[Math.PI / 2, 
      Math.PI / 2
      , 0]}
      scale={[1,1,1]}
      position={[0, 0, 0]} >
      {isMoving &&
        <>
          <FlameShader position={[0, 0.04, -0.32]} scale={[0.3, 0.15, 0.3]} rotation={[Math.PI / 2, 0, 0]} color1={hexToRgb(colorSkull)} />
          <FlameShader position={[0, 0.04, -0.32]} scale={[0.31, 0.13, 0.32]} rotation={[Math.PI / 2, 2, 0]} color1={hexToRgb(chromaScale((t.current + 0.2) % 1).hex())} />
          <FlameShader position={[0, 0.08, -0.3]} scale={[0.1, 0.15, 0.32]} rotation={[Math.PI / 2, 0.5, 0]} color1={hexToRgb(chromaScale((t.current + 0.1) % 1).hex())} />
          <FlameShader position={[0, 0.04, -0.32]} scale={[0.28, 0.16, 0.24]} rotation={[Math.PI / 2, 1, 0]} color1={hexToRgb(chromaScale((t.current + 0.5) % 1).hex())} />
          <FlameShader position={[0, 0.04, -0.33]} scale={[0.21, 0.11, 0.20]} rotation={[Math.PI / 2, 1, 0]} color1={hexToRgb('#9e2630')} />
        </>}

      <group

        scale={[0.004, 0.004, 0.0036]} dispose={null}>
        <group >
          <mesh geometry={nodes.model_1.geometry} rotation={[0.5, 0, 0]} scale={[1, 1, 1]} material={materials['Material.014']} castShadow/>
        </group>
      </group>
    </group>
  )
}