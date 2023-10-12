import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import { ModelsToScene } from "./ModelsToScene";
import Lights from "./SceneLights";
import SceneEffect from "./SceneEffect";
import { Selection } from "@react-three/postprocessing";
import { useState } from "react";
import MainBoutonMenu from "./MainBoutonMenu";
import { ActualRefMenu, useMeshState } from "../../ContextBoard";

export const CanvasContainer = styled.div`
position: absolute;
width: 80vw;
height: 100vh;
overflow: hidden;
overflow-x: hidden;
overflow-y: hidden;
left: 20%;
margin: 0;
padding: 0;
z-index: -1;
`;

export default function HomeScene() {
    const { meshRefs } = useMeshState();
    const [actualRef, setActualRef] = useState(meshRefs.Play);
    const [cursor, setCursor] = useState('default');

    return (
        <ActualRefMenu.Provider value={{ actualRef, setActualRef }}>
            <CanvasContainer style={{ cursor: cursor }}>
                <Canvas
                    camera={{
                        fov: 35,
                        near: 0.1,
                        far: 10,
                        position: [0, 3, 9]
                    }}
                >
                    <Lights />
                    <gridHelper />
                    <Selection>
                        <SceneEffect />
                        <MainBoutonMenu setCursor={setCursor} />
                        <ModelsToScene />
                    </Selection>
                </Canvas>
            </CanvasContainer>
        </ActualRefMenu.Provider>
    );
}