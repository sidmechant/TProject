import { GameService } from './game.service';
import { Match } from '@prisma/client';
import { UpdateScoreDto } from '../dto/match.dto';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    createGame(req: any): Promise<Match>;
    updatePlayerAScore(req: any, updateScoreDto: UpdateScoreDto): Promise<Match>;
    updatePlayerBScore(req: any, updateScoreDto: UpdateScoreDto): Promise<Match>;
    getMatchById(req: any): Promise<Match>;
    getAllMatchesByPlayerId(req: any): Promise<Match[]>;
    deleteMatch(req: any): Promise<Match>;
}
