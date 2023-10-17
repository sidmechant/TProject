import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { channel } from "diagnostics_channel";
import { OnEvent } from "@nestjs/event-emitter";
import { NewMessageDTO } from "./socket.dto";
import { Channel } from "@prisma/client";

@WebSocketGateway({

    cors: {
        origin: '*'
    },
})

export class SocketGateway {
	constructor() {}

	@WebSocketServer()
    io: Server;

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

	@SubscribeMessage('messageSubmit')
	handleMessageSubmit(@MessageBody() name: string) {
		console.log(`${name} sent a message`);
	}

	@OnEvent('newMessage')
	handleSendMessage(@MessageBody() payload: NewMessageDTO) {

		console.log("newMessage: ", payload);
		this.io.to(payload.channelId).emit('newMessage', payload);
	}

	@OnEvent('newChannel')
	handleNewChannel(@MessageBody() payload: Channel) {
		console.log("new channel: ", payload);
		this.io.emit('newChannel', payload);
	}
}