import { Socket } from "socket.io";
import { Room } from "./Room";
import { Player } from "./types/machine";
import {Injectable } from '@nestjs/common'


@Injectable()
export class MatchMaking {
    private rooms: Room[] = [];

    public add(client: Socket): void {
        if (!this.rooms.find(r => r.join(client))) {
            const newRoom = new Room;
            newRoom.join(client);
            this.rooms.push(newRoom);
        }
        console.log('----- ADD -----');
        console.log(this.rooms.map(r => r.players));
        console.log(this.rooms.length);

        this.merge();
    };

    public getRoom(client: Socket): Room {
        return this.rooms.find(room => room.players.some(p => p.client === client));
    };

    public remove(client: Socket): void {
        const room: Room | undefined = this.rooms.find(r => r.leave(client));

        if (room && room.isEmpty) {
            const index: number = this.rooms.indexOf(room);
            room.stop();
            this.rooms.splice(index, 1);
        }
        console.log('----- REMOVE -----');
        console.log(this.rooms.map(r => r.players));
        console.log(this.rooms.length);

        this.merge();
    };

    public merge(): void {
        const singlePlayerRooms = this.rooms.filter(room => !room.isFull);

        for (let i = 0; i < singlePlayerRooms.length; i += 2) {
            const room1 = singlePlayerRooms[i];
            const room2 = singlePlayerRooms[i + 1];

            if (room2) {
                const { client, name, map }: { client: Socket, name: Player['name'], map: Player['map'] } = room2.players[0];

                if (room1.join(client, name)) {
                    const index: number = this.rooms.indexOf(room2);
                    room2.stop();
                    this.rooms.splice(index, 1);

                    room1.chooseMap(client, map);
                    room1.start(client);
                    console.log('----- MERGE -----');
                    console.log(this.rooms.map(r => r.players));
                    console.log(this.rooms.length);
                }
            }
        }
    };
}