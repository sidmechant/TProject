import { Match } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PlayersService } from '../players/players.service';
export declare class GameService {
    private readonly prisma;
    private readonly playersService;
    constructor(prisma: PrismaService, playersService: PlayersService);
    createMatch(playerAId: number, playerBId: number): Promise<Match>;
    updatePlayerAScore(matchId: number, newScoreA: number): Promise<Match>;
    updatePlayerBScore(matchId: number, newScoreB: number): Promise<Match>;
    getMatchById(matchId: number): Promise<Match>;
    getAllMatchesByPlayerId(playerId: number): Promise<Match[]>;
    deleteMatch(matchId: number): Promise<Match>;
}
