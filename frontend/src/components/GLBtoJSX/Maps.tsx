import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { PropsJsxMap } from '../../types/Map'
import { DissolveMaterial } from './DissolveMaterial'
import { useEffect, useState } from 'react'
import FireShader from './FireShader'
import StarsDisappearEffect from '../Animation/StarsDisepearEffect'
import { AnimationSkillMedieval, AnimationUltiMedieval } from './AnimationPower'
import { useGame } from '../../store/hooks/useGame'
import { MedievalSkill } from '../../types/physics'

useGLTF.preload('./assets/maps/RetroMap.glb')
useGLTF.preload('./assets/maps/NinjaMap.glb')
useGLTF.preload('./assets/maps/MedievalMap.glb')


//Map Medieval

type GLTFResultMedieval = GLTF & {
    nodes: {
        Merged_Fence_Plank_12: THREE.Mesh
        Merged_Fence_Plank_10: THREE.Mesh
    }
    materials: {
        Material__25: THREE.MeshStandardMaterial
        Material__26: THREE.MeshStandardMaterial
    }
}

export function MedievalMap({ ref1, index, visible = true, skillInfo }: PropsJsxMap) {
    const { nodes, materials } = useGLTF('./assets/maps/MedievalMap.glb') as GLTFResultMedieval
    const { context } = useGame();
    const [isVisible, setIsVisible] = useState(true);
    const location = context.players[index].location!;
    const ulti = context.players[index].ulti;
    const colors = context.starsColor;

    useEffect(() => {
        if (visible === true && isVisible === false)
            setIsVisible(visible);
    }, [visible]);

    return (
        <>
            <StarsDisappearEffect visible={visible} location={location} colors={colors} />
            <group ref={ref1}>
                <group
                position={[3.72 * location, 0 * location, -0.693]}
                rotation={[Math.PI / 2, -Math.PI / 2 * location, 0]}
                scale={[0.00322, 0.003, 0.003]} dispose={null}>
                <group scale={[220, 300, 300]} rotation={[Math.PI / 2, Math.PI / 1, -Math.PI / 2]} position={[-7, 270, -1800]}>
                    {(skillInfo) && ulti && <AnimationUltiMedieval location={location} isActive={(skillInfo as MedievalSkill).ulti.stone} />}
                    {(skillInfo) && <AnimationSkillMedieval leftPillar={(skillInfo as MedievalSkill).power.left} rightPillar={(skillInfo as MedievalSkill).power.right} />}
                </group>
                <group>
                    <mesh geometry={nodes.Merged_Fence_Plank_12.geometry} material={materials.Material__25} rotation={[-Math.PI / 2, 0, 0]} receiveShadow />
                </group>
                <group position={[0, 130, -950]} visible={isVisible}>
                    <mesh geometry={nodes.Merged_Fence_Plank_10.geometry} rotation={[-Math.PI / 2, 0, 0]} >
                        <DissolveMaterial
                            onFadeOut={() => (setIsVisible(false))}
                            color="#1acfc6"
                            visible={visible}
                            duration={visible ? 1 : 3}
                            baseMaterial={materials.Material__26} />
                    </mesh>
                </group>
            </group>
        </group >
        </>
    )
}

//Map Ninja

type GLTFResultNinja = GLTF & {
    nodes: {
        Pont_Asiatique_Scene_Retopo: THREE.Mesh
        Asie_Pont: THREE.Mesh
    }
    materials: {
        Material__26: THREE.MeshStandardMaterial
        Material__25: THREE.MeshStandardMaterial
    }
}

export function NinjaMap({ ref1, index, visible = true }: PropsJsxMap) {
    const { nodes, materials } = useGLTF('./assets/maps/NinjaMap.glb') as GLTFResultNinja;
    const { context } = useGame();
    const [isVisible, setIsVisible] = useState(true);
    const location = context.players[index].location!;
    const ulti = context.players[index].ulti;
    const colors = context.starsColor;

    useEffect(() => {
        if (visible === true && isVisible === false)
            setIsVisible(visible);
    }
        , [visible]);

    return (
        <>
            <StarsDisappearEffect visible={visible} location={location} colors={colors} />
            <group ref={ref1}
                position={[4.59 * location, 0.75 * location, -0.67]}
                rotation={[Math.PI / 2, -Math.PI / 2 * location, 0]}
                scale={0.03}
                dispose={null}>
                <group visible={isVisible}>
                    <mesh geometry={nodes.Pont_Asiatique_Scene_Retopo.geometry} position={[0, 0, -12]} scale={[1, 1, 0.85]} >
                        <DissolveMaterial
                            onFadeOut={() => (setIsVisible(false))}
                            visible={visible}
                            duration={visible ? 1 : 3}
                            baseMaterial={materials.Material__26} />
                    </mesh>
                </group>
                <mesh geometry={nodes.Asie_Pont.geometry} material={materials.Material__25} receiveShadow />
            </group>
        </>
    )
}

//Map Retro

type GLTFResultRetro = GLTF & {
    nodes: {
        Object_0007: THREE.Mesh
        Object_0007_1: THREE.Mesh
        Plane003_1: THREE.Mesh
        Plane003_2: THREE.Mesh
        Plane003_3: THREE.Mesh
        Plane003_4: THREE.Mesh
        Plane003_5: THREE.Mesh
        Plane003_6: THREE.Mesh
        Plane003_7: THREE.Mesh
        Plane003_8: THREE.Mesh
        Plane003_9: THREE.Mesh
        Plane003_10: THREE.Mesh
    }
    materials: {
        pillar: THREE.MeshStandardMaterial
        ['Material.010']: THREE.MeshStandardMaterial
        ['Material.011']: THREE.MeshStandardMaterial
        ['Material.015']: THREE.MeshStandardMaterial
        Material: THREE.MeshStandardMaterial
        ['Material.012']: THREE.MeshStandardMaterial
        ['Material.004']: THREE.MeshStandardMaterial
        ['Material.001']: THREE.MeshStandardMaterial
        ['Material.002']: THREE.MeshStandardMaterial
        ['Material.013']: THREE.MeshStandardMaterial
        ['Material.006']: THREE.MeshStandardMaterial
    }
}

export function RetroMap({ ref1, index, visible = true }: PropsJsxMap) {
    const { nodes, materials } = useGLTF('./assets/maps/RetroMap.glb') as GLTFResultRetro
    const { context } = useGame();
    const [isVisible, setIsVisible] = useState(true);
    const location = context.players[index].location!;
    const ulti = context.players[index].ulti;
    const colors = context.starsColor;

    useEffect(() => {
        if (visible === true && isVisible === false)
            setIsVisible(visible);
    }
        , [visible]);

    Object.values(materials).forEach((material) => {
        if (material.map) {
            material.map.minFilter = THREE.LinearFilter;
            material.map.magFilter = THREE.LinearFilter;
            material.map.needsUpdate = true;
            material.map.anisotropy = 16;
        }
        if (material.normalMap) {
            material.normalMap.minFilter = THREE.LinearFilter;
            material.normalMap.magFilter = THREE.LinearFilter;
            material.normalMap.needsUpdate = true;
        }
    });
    return (
        <>
            <StarsDisappearEffect visible={visible} location={location} colors={colors} />
            <group ref={ref1}
                position={[3.7 * location, 0 * location, -0.6]}
                rotation={[Math.PI / 2, -Math.PI / 2 * location, 0]}
                scale={[0.325, 0.3, 0.3]}
                dispose={null}>
                {(visible) && <FireShader position={[0, 3.8, -8]} scale={[1.8, 1.3, 1.3]} />}
                <group position={[7.54, 2.835, 0.969]} scale={[1, 3.016, 1]}>
                    <mesh geometry={nodes.Object_0007.geometry} material={materials.pillar} />
                    <mesh geometry={nodes.Object_0007_1.geometry} material={materials['Material.010']} receiveShadow />
                </group>
                <group position={[0.153, 8.479, -11.991]} visible={isVisible} >

                    <mesh geometry={nodes.Plane003_1.geometry}>
                        <DissolveMaterial
                            onFadeOut={() => (setIsVisible(false))}
                            color="#0be61d"
                            visible={visible}
                            duration={visible ? 1 : 3}
                            baseMaterial={materials['Material.011']} />
                    </mesh>
                    <mesh geometry={nodes.Plane003_2.geometry} >
                        <DissolveMaterial
                            visible={visible}
                            color="#0be61d"
                            duration={visible ? 1 : 3}
                            baseMaterial={materials['Material.015']} />
                    </mesh>
                    <mesh geometry={nodes.Plane003_3.geometry}>
                        <DissolveMaterial
                            visible={visible}
                            color="#0be61d"
                            duration={visible ? 1 : 3}
                            baseMaterial={materials.Material} />
                    </mesh>

                    <mesh geometry={nodes.Plane003_4.geometry} >
                        <DissolveMaterial
                            visible={visible}
                            color="#0be61d"
                            duration={visible ? 1 : 3}
                            baseMaterial={materials['Material.012']} />
                    </mesh>
                    <mesh geometry={nodes.Plane003_5.geometry} >
                        <DissolveMaterial
                            visible={visible}
                            color="#0be61d"
                            duration={visible ? 1 : 3}
                            baseMaterial={materials['Material.004']} />
                    </mesh>
                    <mesh geometry={nodes.Plane003_6.geometry} >
                        <DissolveMaterial
                            visible={visible}
                            color="#0be61d"
                            duration={visible ? 1 : 3}
                            baseMaterial={materials['Material.001']} />
                    </mesh>
                    <mesh geometry={nodes.Plane003_7.geometry} >
                        <DissolveMaterial
                            visible={visible}
                            color="#0be61d"
                            duration={visible ? 1 : 3}
                            baseMaterial={materials['Material.002']} />
                    </mesh>
                    <mesh geometry={nodes.Plane003_8.geometry} >
                        <DissolveMaterial
                            visible={visible}
                            color="#0be61d"
                            duration={visible ? 1 : 3}
                            baseMaterial={materials['Material.013']} />
                    </mesh>

                    <mesh geometry={nodes.Plane003_9.geometry} >
                        <DissolveMaterial
                            visible={visible}
                            color="#0be61d"
                            duration={visible ? 1 : 3}
                            baseMaterial={materials['Material.006']} />
                    </mesh>

                    <mesh geometry={nodes.Plane003_10.geometry} >
                        <DissolveMaterial
                            visible={visible}
                            color="#0be61d"
                            duration={visible ? 1 : 3}
                            baseMaterial={materials.pillar} />
                    </mesh>
                </group>
            </group>
        </>
    )
}

