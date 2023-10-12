import { Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import {FriendsService} from '../friends/friends.service'

export interface IGatewaySessionManager {
  getUserSocket(id: number): any; // Utilisez le type approprié pour le socket
  setUserSocket(token: string, socket: any): void; // Utilisez le type approprié pour le socket
  removeUserSocket(id: number): void;
  getSockets(): Map<number, any>; // Utilisez le type approprié pour le socket
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager{
  constructor(private FriendService: FriendsService) {}
  private readonly sessions: Map<number, any> = new Map(); // Utilisez le type approprié pour le socket

  getUserSocket(id: number) {
    return this.sessions.get(id);
  }

  setUserSocket(token: string, socket: any) {
    // Vérifiez le token JWT ici pour extraire l'ID de l'utilisateur
    try {
      const decoded = verify(token, process.env.JWT_SECRET) // Remplacez par votre secret JWT
      const userId = decoded.sub;
      const numberUserId = Number(userId)
      // Stockez le socket dans la session en utilisant l'ID de l'utilisateur comme clé
      this.sessions.set(numberUserId, socket);
      this.FriendService.setOnlineStatus(numberUserId, true);

    } catch (error) {
      // Gérez les erreurs de vérification du token JWT ici
      throw new Error('Invalid JWT token');
    }
  }

  removeUserSocket(userId: number) {
    this.FriendService.setOnlineStatus(userId, false);
    this.sessions.delete(userId);
  }

  getSockets(): Map<number, any> { // Utilisez le type approprié pour le socket
    return this.sessions;
  }
}
