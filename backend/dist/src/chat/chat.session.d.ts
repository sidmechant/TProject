import { FriendsService } from '../friends/friends.service';
export interface IGatewaySessionManager {
    getUserSocket(id: number): any;
    setUserSocket(token: string, socket: any): void;
    removeUserSocket(token: string): void;
    getSockets(): Map<number, any>;
}
export declare class GatewaySessionManager implements IGatewaySessionManager {
    private FriendService;
    constructor(FriendService: FriendsService);
    private readonly sessions;
    getUserSocket(id: number): any;
    setUserSocket(token: string, id: any): void;
    removeUserSocket(token: string): void;
    getSockets(): Map<number, any>;
}
