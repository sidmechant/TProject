"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchMaking = void 0;
const Room_1 = require("./Room");
const common_1 = require("@nestjs/common");
let MatchMaking = class MatchMaking {
    constructor() {
        this.rooms = [];
    }
    add(client) {
        if (!this.rooms.find(r => r.join(client))) {
            const newRoom = new Room_1.Room;
            newRoom.join(client);
            this.rooms.push(newRoom);
        }
        console.log('----- ADD -----');
        console.log(this.rooms.map(r => r.players));
        console.log(this.rooms.length);
        this.merge();
    }
    ;
    getRoom(client) {
        return this.rooms.find(room => room.players.some(p => p.client === client));
    }
    ;
    remove(client) {
        const room = this.rooms.find(r => r.leave(client));
        if (room && room.isEmpty) {
            const index = this.rooms.indexOf(room);
            room.stop();
            this.rooms.splice(index, 1);
        }
        console.log('----- REMOVE -----');
        console.log(this.rooms.map(r => r.players));
        console.log(this.rooms.length);
        this.merge();
    }
    ;
    merge() {
        const singlePlayerRooms = this.rooms.filter(room => !room.isFull);
        for (let i = 0; i < singlePlayerRooms.length; i += 2) {
            const room1 = singlePlayerRooms[i];
            const room2 = singlePlayerRooms[i + 1];
            if (room2) {
                const { client, name, map } = room2.players[0];
                if (room1.join(client, name)) {
                    const index = this.rooms.indexOf(room2);
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
    }
    ;
};
exports.MatchMaking = MatchMaking;
exports.MatchMaking = MatchMaking = __decorate([
    (0, common_1.Injectable)()
], MatchMaking);
//# sourceMappingURL=MatchMaking.js.map