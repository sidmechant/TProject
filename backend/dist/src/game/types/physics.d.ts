/// <reference types="node" />
import * as P2 from 'p2-es';
import { MapTheme } from './machine';
export type Location = -1 | 1;
export type Vector3 = {
    x: number;
    y: number;
    z: number;
};
export type Ball = {
    score: Location | 0;
    body: P2.Body;
    impulse: P2.Vec2;
    counter: number;
    start: (emit: (type: string | symbol, ...args: any[]) => boolean) => number;
    step: (delta: number) => void;
    reset: () => void;
};
export type Player = {
    body: P2.Body;
    map: MapTheme;
    key: {
        leftward: boolean;
        rightward: boolean;
    };
    power: boolean;
    ulti: boolean;
    location: Location;
    powerMedieval: {
        body: P2.Body | undefined;
        isDestroy: boolean;
    };
    ultiMedieval: {
        stones: {
            body: P2.Body | undefined;
            isDestroy: boolean;
        }[];
    };
    powerNinja: {
        speedFactor: number;
        apply: () => void;
    };
    powerWestern: {
        isActive: boolean;
        apply: () => void;
    };
    powerRetro: {};
    step: (delta: number) => void;
    reset: () => void;
};
export type World = P2.World & {
    interval?: NodeJS.Timeout;
    collisions?: {
        paddle: [number, number];
        border: number;
        stone: number;
    };
    play?: () => void;
    pause?: () => void;
    stop?: () => void;
};
export type MedievalSkill = {
    power: {
        left: boolean;
        right: boolean;
    };
    ulti: {
        stone: boolean[];
    };
};
export type NinjaSkill = {
    power: {
        factor: number;
    };
    ulti: {};
};
export type WesternSkill = {
    power: {
        isActive: boolean;
    };
    ulti: {};
};
export type RetroSkill = {
    power: {
        isActive: boolean;
    };
    ulti: {};
};
export type Power = MedievalSkill | NinjaSkill | WesternSkill | RetroSkill | {};
