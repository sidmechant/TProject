import { mapName, MapInfo, MapsAssets, PropsJsxMap, PropsJsxBall, PropsJsxPaddle } from '../../types/Map';
import { MapTheme } from '../../types/machine';
import { NinjaMap, RetroMap, MedievalMap } from '../../components/GLBtoJSX/Maps';
import { MedievalBall, RetroBall, NinjaBall, DesertBall } from '../../components/GLBtoJSX/Balls';
import { RetroPaddle, MedievalPaddle, NinjaPaddle, DesertPaddle } from '../../components/GLBtoJSX/Paddles';


export class MapObject {
    id: MapTheme;
    mapName: mapName;

    glbPath: string;
    previewImagePath: string;
    loadingBackground: string;
    font: string;
    mainColor: string;
    secondaryColor: string;
    JsxMap: (props: PropsJsxMap) => JSX.Element;
    JsxBall: (props: PropsJsxBall) => JSX.Element;
    JsxPaddle: (props: PropsJsxPaddle) => JSX.Element;

    constructor(props: MapInfo) {
        this.id = props.id;
        this.glbPath = props.glbPath;
        this.previewImagePath = props.previewImagePath;
        this.mapName = props.mapName;
        this.font = props.font;
        this.loadingBackground = props.loadingBackground;
        this.mainColor = props.mainColor;
        this.secondaryColor = props.secondaryColor;
        this.JsxMap = props.mapJSX;
        this.JsxPaddle = props.paddleJSX;
        this.JsxBall = props.ballJSX;
    }
}

const western: MapInfo = {
    id: 'western',
    glbPath: 'assets/Western.glb',
    previewImagePath: 'assets/Western.png',
    mapName: 'Cactus Canyon',
    font: 'Albertson',
    loadingBackground: 'assets/Western.png',
    mainColor: '#FEB64A',
    secondaryColor: '#165C5D',
    mapJSX: MedievalMap,
    ballJSX: DesertBall,
    paddleJSX: DesertPaddle
}

const retro: MapInfo = {
    id: 'retro',
    glbPath: 'assets/Retro.glb',
    previewImagePath: 'assets/Retro.png',
    mapName: 'Pixel Purgatory',
    font: 'Yoster',
    loadingBackground: 'assets/Retro.png',
    mainColor: '#C39253',
    secondaryColor: '#215B33',
    mapJSX: RetroMap,
    ballJSX: RetroBall,
    paddleJSX: RetroPaddle
}

const medieval: MapInfo = {
    id: 'medieval',
    glbPath: 'assets/Medieval.glb',
    previewImagePath: 'assets/Medieval.png',
    mapName: 'Chivalry\'s Last Stand',
    font: 'Redfighter',
    loadingBackground: 'assets/Medieval.png',
    mainColor: '#47BCFF',
    secondaryColor: '#882178',
    mapJSX: MedievalMap,
    ballJSX: MedievalBall,
    paddleJSX: MedievalPaddle
}

const ninja: MapInfo = {
    id: 'ninja',
    glbPath: 'assets/Ninja.glb',
    previewImagePath: 'assets/Ninja.png',
    mapName: 'Temple of the Silent Kunoichi',
    font: 'Aasianninja',
    loadingBackground: 'assets/Ninja.png',
    mainColor: '#FFAE61',
    secondaryColor: '#CD5050',
    mapJSX: NinjaMap,
    ballJSX: NinjaBall,
    paddleJSX: NinjaPaddle
}

export const mapsAssets: MapsAssets = {
    medieval: new MapObject(medieval),
    western: new MapObject(western),
    ninja: new MapObject(ninja),
    retro: new MapObject(retro)
}