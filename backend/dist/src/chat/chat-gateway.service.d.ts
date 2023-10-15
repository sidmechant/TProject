import { ChatGateway } from './chat.gateway';
export declare class ChatGatewayService {
    private readonly chatGateway;
    constructor(chatGateway: ChatGateway);
    sendMessage(message: string): void;
}
