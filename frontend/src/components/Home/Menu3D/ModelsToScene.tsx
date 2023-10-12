import { Shuriken, Spiked_Ball, ModelFortyTwo } from "../../GLBtoJSX/AssetsMenu";
import { MenuFont } from "../../GLBtoJSX/Menu";
import { degToRad } from "three/src/math/MathUtils.js";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from 'three';
import { RotatingMesh } from "./MenuRotating";
import SceneIntroAnimation from "./SceneIntroAnimation";
import MeshSelectedAnimation from "./MeshSelectedAnimation";

export function ModelsToScene() {

    const menu_obj = [
        useRef<Mesh>(null),
        useRef<Mesh>(null),
        useRef<Mesh>(null),
    ]

    const size_obj = [
        0.025,
        0.2,
        0.2,
    ]

    useFrame(state => {

        const time = state.clock.getElapsedTime();

        if (menu_obj[0].current) {
            menu_obj[0].current.rotation.y += 0.01;
        }
        if (menu_obj[1].current) {
            menu_obj[1].current.rotation.z += 0.03;
            menu_obj[1].current.rotation.y = Math.sin(time / 5) / 3 + 2;
        }
        if (menu_obj[2].current) {
            menu_obj[2].current.rotation.z = Math.sin(time / 5) / 3;
            menu_obj[2].current.rotation.x = Math.cos(time / 5) / 3;
        }
    });

    return (
        <>
            <SceneIntroAnimation menu_obj={menu_obj} size_obj={size_obj} />
            <RotatingMesh >
                <MenuFont />
            </RotatingMesh>
            <MeshSelectedAnimation />
            <ModelFortyTwo
                ref={menu_obj[2]}
                position={[2.2, -2, 1]}
                scale={size_obj[2]}
                rotation={[degToRad(19), degToRad(-100), degToRad(39)]}
            />
            <Shuriken
                ref={menu_obj[1]}
                position={[2.5, 2, -0.5]}
                scale={size_obj[1]}
                rotation={[degToRad(-10), degToRad(-82), degToRad(39)]}
            />
            <Spiked_Ball
                ref={menu_obj[0]}
                position={[-1, 2.3, 2]}
                scale={size_obj[0]}
                rotation={[degToRad(19), degToRad(-100), degToRad(39)]} />
        </>

    );
}