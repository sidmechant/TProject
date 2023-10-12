import { Injectable, NotFoundException, InternalServerErrorException} from '@nestjs/common';
import { Match, Player } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PlayersService } from '../players/players.service';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly playersService: PlayersService,
  ) {}

  /**
   * Creates a new match between two players.
   * @param playerAId - The ID of player A.
   * @param playerBId - The ID of player B.
   * @returns A promise that resolves to the created match.
   * @throws {NotFoundException} If either player A or player B is not found.
   * @throws {InternalServerErrorException} If an error occurs while creating the match.
   */
  async createMatch(playerAId: number, playerBId: number): Promise<Match> {
    const playerA: Player = await this.playersService.getPlayerById(playerAId);
    const playerB: Player = await this.playersService.getPlayerById(playerBId);
    if (!playerA) throw new NotFoundException(`Player with ID ${playerAId} not found`);
    if (!playerB) throw new NotFoundException(`Player with ID ${playerBId} not found`);

    try {
        playerAId = Number(playerAId);
        playerBId = Number(playerBId);
        const match = await this.prisma.match.create({
          data: {
            playerAId,
            playerBId
          },
        });
        await this.playersService.addMatchToPlayer(playerAId, match.id);
        await this.playersService.addMatchToPlayer(playerBId, match.id);
        return match;
    } catch (error) {
      console.error("Error in createMatch", error);
      throw new InternalServerErrorException("An error occurred while creating the match.");
    }
  }

    /**
   * Updates the scoreA of a match.
   * @param matchId - The ID of the match to update.
   * @param newScoreA - The new scoreA value.
   * @returns A promise that resolves to the updated match.
   * @throws {NotFoundException} If the match is not found.
   * @throws {InternalServerErrorException} If an error occurs while updating the match.
   */
    async updatePlayerAScore(matchId: number, newScoreA: number): Promise<Match> {
      const match = await this.prisma.match.update({
        where: { id: matchId },
        data: { scoreA: newScoreA },
      });
      if (!match) throw new NotFoundException(`Match with ID ${matchId} not found`);
      return match;
    }
  
    /**
     * Updates the scoreB of a match.
     * @param matchId - The ID of the match to update.
     * @param newScoreB - The new scoreB value.
     * @returns A promise that resolves to the updated match.
     * @throws {NotFoundException} If the match is not found.
     * @throws {InternalServerErrorException} If an error occurs while updating the match.
     */
    async updatePlayerBScore(matchId: number, newScoreB: number): Promise<Match> {
      const match = await this.prisma.match.update({
        where: { id: matchId },
        data: { scoreB: newScoreB },
      });
      if (!match) throw new NotFoundException(`Match with ID ${matchId} not found`);
      return match;
    }
  
    /**
     * Gets a match by its ID.
     * @param matchId - The ID of the match to retrieve.
     * @returns A promise that resolves to the match.
     * @throws {NotFoundException} If the match is not found.
     */
    async getMatchById(matchId: number): Promise<Match> {
      const match = await this.prisma.match.findUnique({ where: { id: matchId } });
      if (!match) throw new NotFoundException(`Match with ID ${matchId} not found`);
      return match;
    }
  
    /**
     * Gets all matches played by a player.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of matches played by the player.
     * @throws {NotFoundException} If the player is not found.
     */
    async getAllMatchesByPlayerId(playerId: number): Promise<Match[]> {
      const player = await this.playersService.getPlayerById(playerId);
      if (!player) throw new NotFoundException(`Player with ID ${playerId} not found`);
      
      const matchesA = await this.prisma.match.findMany({ where: { playerAId: playerId } });
      const matchesB = await this.prisma.match.findMany({ where: { playerBId: playerId } });
      return [...matchesA, ...matchesB];
    }
  
    /**
    * Supprime un match par son ID.
    * @param matchId - L'ID du match à supprimer.
    * @returns A promise that resolves to the deleted match.
    * @throws {NotFoundException} Si le match n'est pas trouvé.
    * @throws {InternalServerErrorException} Si une erreur survient lors de la suppression du match.
    */
   async deleteMatch(matchId: number): Promise<Match> {
     const match = await this.prisma.match.findUnique({ where: { id: matchId } });
     if (!match) throw new NotFoundException(`Match with ID ${matchId} not found`);
 
     try {
       const deletedMatch = await this.prisma.match.delete({ where: { id: matchId } });
       return deletedMatch;
     } catch (error) {
       console.error("Error in deleteMatch", error);
       throw new InternalServerErrorException("An error occurred while deleting the match.");
     }
   }
  
}