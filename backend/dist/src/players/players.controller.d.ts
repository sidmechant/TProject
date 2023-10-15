import { PlayersService } from './players.service';
import { Player } from '@prisma/client';
import { UpdatePhotoDto, UpdatePseudoDto, PseudoDto } from './players.dto';
export declare class PlayersController {
    private readonly playersService;
    constructor(playersService: PlayersService);
    getPlayerbyId(req: any): Promise<{
        player: Player;
        role: string;
        isProfileUpdated: boolean;
        isTwoFactorAuthEnabled: boolean;
    }>;
    getPhotoUrl(req: any): Promise<{
        urlPhotoProfile: string;
    }>;
    setPlayerUrlPhotoProfile(req: any, updatePhotoDto: UpdatePhotoDto): Promise<{
        updatedPlayer: Player;
        isProfileUpdated: boolean;
    }>;
    setPlayerPseudo(req: any, dto: UpdatePseudoDto): Promise<{
        pseudo: Player;
        isProfileUpdated: boolean;
    }>;
    getAllMatchesByPlayerId(req: any): Promise<any>;
    getAllPlayers(): Promise<Player[]>;
    deletePlayer(req: any): Promise<Player>;
    getUserByPseudo(params: PseudoDto): Promise<Player>;
    sendFriendRequest(req: any, dto: {
        receiverPseudo: string;
    }): Promise<any>;
    acceptFriendRequest(req: any, dto: {
        requesterId: number;
    }): Promise<any>;
    declineFriendRequest(req: any, dto: {
        requesterId: number;
    }): Promise<any>;
    searchPseudo(req: any, pseudoToSearch: string): Promise<Player | null>;
}
