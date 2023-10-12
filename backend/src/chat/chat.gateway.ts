import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FriendRequestsEvents } from '../friend-request/friends.events';
import { GatewaySessionManager } from './chat.session'; // Importez votre gestionnaire de sessions

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly friendRequestsEvents: FriendRequestsEvents,
    public readonly sessionManager: GatewaySessionManager, // Injectez votre GatewaySessionManager
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    console.log('Client connected CHAT:', token);

    // Utilisez votre sessionManager pour associer le socket à l'utilisateur
    this.sessionManager.setUserSocket(token, client);
  }

  async handleDisconnect(client: Socket) {
    console.log('Client disconnected CHAT:', client.id);

    // Utilisez votre sessionManager pour supprimer le socket de l'utilisateur lorsqu'il se déconnecte
    const token = client.handshake.query.token as string;
    // this.sessionManager.removeUserSocket(token);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    const formattedMessage = `Nouveau message : ${message}`;
    console.log(message);
    this.server.emit('message', formattedMessage);
  }

  @SubscribeMessage('onFriendRequestReceived')
  onFriendRequestReceived(client: Socket, payload: any): void {
    // Traitez ici l'événement de demande d'ami reçu
    console.log('Received Friend Request:', payload);
    // Vous pouvez émettre des messages à partir de cet événement à d'autres clients, le cas échéant
  }

  @SubscribeMessage('onFriendRequestCancelled')
  onFriendRequestCancelled(client: Socket, payload: any): void {
    // Traitez ici l'événement de demande d'ami annulée reçue
    console.log('Cancelled Friend Request:', payload);
    // Vous pouvez émettre des messages à partir de cet événement à d'autres clients, le cas échéant
  }

  // Ajoutez des méthodes similaires pour gérer les autres événements de demande d'amis
}
