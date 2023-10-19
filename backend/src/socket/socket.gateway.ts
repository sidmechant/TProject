import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { OnEvent } from "@nestjs/event-emitter";
import { NewMessageDTO } from "./socket.dto";
import { Channel } from "@prisma/client";

interface ISendEvent {
	target: string,
	type: string,
	content: string,		
}

@WebSocketGateway({

    cors: {
        origin: '*'
    },
})

export class SocketGateway {
	constructor() {}
	@WebSocketServer()
    io: Server;

	private userList: Map<number, any> = new Map();

	@SubscribeMessage('joinChannel')
	handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
		client.join(channelId);
		console.log("client joined room: ", channelId);
	}

	@SubscribeMessage('leaveChannel')
	handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
		client.leave(channelId);
		console.log("client left room: ", channelId);
	}

	@SubscribeMessage('sendEventRoom')
	handleSendEventRoom(@MessageBody() payload: ISendEvent, @ConnectedSocket() client: Socket) {

		client.broadcast.to(payload.target).emit('newEvent', payload);
	}

	@SubscribeMessage('sendEvent')
	handleSendEvent(@MessageBody() payload: ISendEvent) {

		console.log("SENDING NEW EVENT");
		const target = this.userList.get(Number(payload.target));
		this.io.to(target).emit('newEvent', payload);
	}

	@SubscribeMessage('messageSubmit')
	handleMessageSubmit(@MessageBody() name: string) {
		console.log(`${name} sent a message`);
	}

	@OnEvent('newMessage')
	handleSendMessage(@MessageBody() payload: NewMessageDTO) {

		this.io.to(payload.channelId).emit('newMessage', payload);
	}

	@OnEvent('newChannel')
	handleNewChannel(@MessageBody() payload: Channel) {
		this.io.emit('newChannel', payload);
	}

	@SubscribeMessage('getConnection')
	handleGetConnection(@ConnectedSocket() client: Socket) {

		const list: number[] = Array.from(this.userList.keys());
		this.io.to(client.id).emit('updateConnection', list);
	}

	@OnEvent('updateConnection')
	handleUpdateConnection(@MessageBody() userIdList: Map<number, any>) {

		this.userList = userIdList;
		const list: number[] = Array.from(this.userList.keys());
		this.io.emit('updateConnection', list);
	}
}