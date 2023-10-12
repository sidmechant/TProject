import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { Mesh, MeshStandardMaterial } from 'three';
import { useActualRefMenu, useMeshState } from '../ContextBoard';
import { Select } from '@react-three/postprocessing';

type GLTFResult = GLTF & {
    nodes: {
        AboutUS: Mesh;
        Profile: Mesh;
        ChatBox: Mesh;
        Play: Mesh;
    };
    materials: {
        ["Material.006"]: MeshStandardMaterial;
        Material: MeshStandardMaterial;
        ["Material.001"]: MeshStandardMaterial;
        ["Material.002"]: MeshStandardMaterial;
    };
};

export function MenuFont(props: JSX.IntrinsicElements["group"]) {

    const { meshRefs } = useMeshState();
    const { actualRef } = useActualRefMenu();
    const { nodes, materials } = useGLTF(
        "./assets/font_menu-transformed.glb"
    ) as GLTFResult;

    return (
        <group ref={meshRefs.group_menu} {...props} dispose={null}>
            <Select enabled={meshRefs.AboutUS === actualRef}>
                <mesh
                    ref={meshRefs.AboutUS}
                    geometry={nodes.AboutUS.geometry}
                    material={materials["Material.006"]}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                />
            </Select>
            <Select enabled={meshRefs.Profile === actualRef}>
                <mesh
                    ref={meshRefs.Profile}
                    geometry={nodes.Profile.geometry}
                    material={materials.Material}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                />
            </Select>
            <Select enabled={meshRefs.ChatBox === actualRef}>
                <mesh
                    ref={meshRefs.ChatBox}
                    geometry={nodes.ChatBox.geometry}
                    material={materials["Material.001"]}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                />
            </Select>
            <Select enabled={meshRefs.Play === actualRef}>
                <mesh
                    ref={meshRefs.Play}
                    geometry={nodes.Play.geometry}
                    material={materials["Material.002"]}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                />
            </Select>
        </group>
    );
}

useGLTF.preload("./assets/font_menu-transformed.glb");