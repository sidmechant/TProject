import { Ball, Player, World } from '../types/physics';
export declare function createWorld({ ball, playerNeg, playerPos }: {
    ball: Ball;
    playerNeg: Player;
    playerPos: Player;
}): Required<World>;
