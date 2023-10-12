import { Euler, Group } from 'three';
import { MapObject } from '../models/MapObject';
import { Position } from '../store/Player';
import { Power } from '../types/physics';

export type GLTFResult = GLTF & {
    nodes: {
        //Balls
        Cactus: THREE.Mesh
        Cactus_Fleur: THREE.Mesh

        Shuriken: THREE.Mesh
        Shuriken_Lame01: THREE.Mesh
        Shuriken_Lame02: THREE.Mesh
        Shuriken_Lame03: THREE.Mesh
        Shuriken_Lame04: THREE.Mesh

        Balle: THREE.Mesh
        Balle_Pique: THREE.Mesh

        //Paddles

        Eventail: THREE.Mesh

        Belier: THREE.Mesh
        Belier_Roue: THREE.Mesh
        Belier_Roue02: THREE.Mesh
        Belier_Belier: THREE.Mesh
        Belier_Tronc_Top: THREE.Mesh
        Belier_Chaine: THREE.Mesh
        Belier_Chaine01: THREE.Mesh

        Handcar: THREE.Mesh
        Handcar_Roue: THREE.Mesh
        Handcar_Roue02: THREE.Mesh
        Handcar_Tige: THREE.Mesh
        Handcar_Rouage: THREE.Mesh
        Handcar_Baton: THREE.Mesh
    }
    materials: {
        Material__25: THREE.MeshStandardMaterial
    }
}


export interface PropsJsxMap {
    ref1?: React.MutableRefObject<Group | null>;
    ref2?: React.MutableRefObject<Group>;
    index: number;
    visible?: boolean;
    skillInfo?: Power
}

export interface PropsJsxPaddle {
    isMe: boolean,
    body: React.MutableRefObject<Group | null>,
    position: Position,
    velocity: Position,
    location: -1 | 1,
    skillInfo?: Power,
    collision: number
}


export interface PropsJsxBall {
    body: React.MutableRefObject<Group | null>,
    position: Position,
    velocity: Position
}

export type modeType =
    'MatchMaking' |
    'IA' |
    '2PLocal' |
    '2POnline' |
    undefined;

export type requestType =
    'uncomplete' |
    'complete';

export type mapName =
    'Cactus Canyon' |
    'Temple of the Silent Kunoichi' |
    'Chivalry\'s Last Stand' |
    'Pixel Purgatory';

export type MapInfo = {
    id: MapTheme,
    mapName: mapName,
    glbPath: string,
    previewImagePath: string,
    font: string,
    loadingBackground: string,
    mainColor: string,
    secondaryColor: string,
    mapJSX: (props: PropsMap) => JSX.Element,
    paddleJSX: (props: PropsJsxPaddle) => JSX.Element,
    ballJSX: (props: PropsJsxBall) => JSX.Element
};

export type MapsAssets = {
    [key in MapTheme]: MapObject;
};

