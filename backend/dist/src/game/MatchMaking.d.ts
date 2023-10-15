import { Socket } from "socket.io";
import { Room } from "./Room";
export declare class MatchMaking {
    private rooms;
    add(client: Socket): void;
    getRoom(client: Socket): Room;
    remove(client: Socket): void;
    merge(): void;
}
