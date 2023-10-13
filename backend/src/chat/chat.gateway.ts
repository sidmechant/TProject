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
import { GatewaySessionManager } from './chat.session'; // Importez votre gestionnaire de sessions
import { OnEvent } from '@nestjs/event-emitter';
import { Friend, User } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    public readonly sessionManager: GatewaySessionManager,   private readonly eventEmitter: EventEmitter2 // Injectez votre GatewaySessionManager
  ) {}

  async handleConnection(client: Socket) {
    console.log("QUERY = ", client.handshake.query);
    const token = client.handshake.query.jwt_token as string;
    console.log('Client connected CHAT:', token);

    // Utilisez votre sessionManager pour associer le socket à l'utilisateur
    this.sessionManager.setUserSocket(token, client);
  }

  async handleDisconnect(client: Socket) {
    // Utilisez votre sessionManager pour supprimer le socket de l'utilisateur lorsqu'il se déconnecte
    const token = client.handshake.query.token as string;
    console.log('Client disconnected CHAT:', token);
    this.sessionManager.removeUserSocket(token);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    const formattedMessage = `Nouveau message : ${message}`;
    console.log(message);
    this.server.emit('message', formattedMessage);
  }

  @OnEvent('friendrequest.create')
  emitFriendRequestCreate(payload: Friend) {
    const receiverSocket = this.sessionManager.getUserSocket(payload.friendId);
    receiverSocket && receiverSocket.emit('onFriendRequestReceived', payload);
  }

  @OnEvent('friendrequest.cancel')
  emitFriendRequestCancel(payload: Friend) {
    const receiverSocket = this.sessionManager.getUserSocket(payload.friendId);
    receiverSocket && receiverSocket.emit('onFriendRequestCancelled', payload);
  }

  @OnEvent('friendrequest.accept')
  emitFriendRequestAccepted(payload: Friend) {
    const senderSocket = this.sessionManager.getUserSocket(payload.userId);
    senderSocket && senderSocket.emit('onFriendRequestAccepted', payload);
  }

  @OnEvent('friendrequest.reject')
  emitFriendRequestRejected(payload: Friend) {
    const senderSocket = this.sessionManager.getUserSocket(payload.userId);
    senderSocket && senderSocket.emit('onFriendRequestRejected', payload);
  }
}
  // Ajoutez des méthodes similaires pour gérer les autres événements de demande d'amis

