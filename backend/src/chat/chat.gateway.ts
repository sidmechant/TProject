import { Injectable, UseGuards } from '@nestjs/common';
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
import { Friend, Message, User } from '@prisma/client';
import { ChannelSocketDto, MessageSocketDto } from 'src/dto/chat.dto';
import { MessageService } from 'src/message/message.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
@UseGuards()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    public readonly sessionManager: GatewaySessionManager,   private readonly eventEmitter: EventEmitter2, // Injectez votre GatewaySessionManager
    private readonly messageService: MessageService
  ) { }

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
   
  /* *************************** CHANNEL ****************************************** */
  
  @SubscribeMessage('onChannelJoin')
  async onConversationJoin(@MessageBody() data: ChannelSocketDto, @ConnectedSocket() client: Socket) {  
    client.join(`channel-${data.channel.id}`);
    console.log(client.rooms);
    client.to(`channel-${data.channel.id}`).emit('userJoin');
  }


  @SubscribeMessage('onChannelLeave')
  onConversationLeave(@MessageBody() data: ChannelSocketDto, @ConnectedSocket() client: Socket) {
    console.log('onChannelLeave');
    client.leave(`Channel-${data.channel.id}`);
    console.log(client.rooms);
    client.to(`Channel-${data.channel.id}`).emit('userLeave');
  }
  
  @OnEvent('channel.create')
  handleChannelCreateEvent(payload: ChannelSocketDto) {
    console.log('Inside conversation.create');
    const recipientSocket = this.sessionManager.getUserSocket(payload.recipient.id);
    if (recipientSocket) recipientSocket.emit('onChannel', payload);
  }
   
  /* ****************************** MESSAGE *************************************** */


  @OnEvent('message.create')
  handleMessageCreateEvent(payload: MessageSocketDto) {
    console.log('Inside message.create');
    const { author, recipient, message } = payload;

    const authorSocket = this.sessionManager.getUserSocket(author.id);
    const recipientSocket = this.sessionManager.getUserSocket(recipient.id);

    if (authorSocket) authorSocket.emit('onMessage', payload);
    if (recipientSocket) recipientSocket.emit('onMessage', payload);
  }

  @OnEvent('message.delete')
  async handleMessageDelete(payload: MessageSocketDto) {
    console.log('Inside message.delete');
    console.log(payload);
    const message = await this.messageService.findMessageByMessageId(payload.message.id);
    if (!message) return;
    const creator = this.sessionManager.getUserSocket(message.userId);
    if (creator) creator.emit('onMessageDelete', payload);
  }

  @OnEvent('message.update')
  async handleMessageUpdate(message: MessageSocketDto) {
    const { author, recipient }= message;
    console.log(message);
    const recipientSocket = this.sessionManager.getUserSocket(message.message.userId)
    recipientSocket.emit('onMessageUpdate', message);
  }

}