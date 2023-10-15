/// <reference types="node" />
import { EventEmitter } from 'events';
import { Player, Power, Vector3, World } from '../types/physics';
import { MapTheme } from '../types/machine';
export declare class Physic extends EventEmitter {
    private ball;
    private players;
    private world;
    constructor(playerNeg: MapTheme, playerPos: MapTheme);
    private getSkillInfo;
    pause(): void;
    play(): void;
    setKeys(index: number, key: Player['key']): void;
    setPower(index: number, power: boolean): void;
    setUlti(index: number, ulti: boolean): void;
    start(): number;
    stop(): void;
    get ballPosition(): Vector3;
    get ballVelocity(): Vector3;
    get collisions(): Required<World>['collisions'];
    get playersPosition(): Vector3[];
    get playersVelocity(): Vector3[];
    get skillInfo(): [Power, Power];
    get powerIsActive(): [boolean, boolean];
}
