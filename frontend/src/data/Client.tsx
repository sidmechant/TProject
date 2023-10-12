import { Socket } from "socket.io-client";
import { GameContext, GameEvents, MapTheme } from "../types/machine";
import { useGame } from "../store/hooks/useGame";

export const client = {
    token: undefined as string | undefined,
    socket: undefined as Socket | undefined,
}

export interface ConnectPlayers {
    id: string,
    name: string,
    map: MapTheme
}

export interface ConnectInfo {
    players: ConnectPlayers[]
}

export interface StartInfo {
    current: number
}

export function connectPlayers(): Promise<ConnectInfo> {
    return new Promise((resolve, _) => {
        client.socket?.on('connection', (data: ConnectInfo) => resolve(data));
        client.socket?.emit('connection');
        console.log('Server: emit: connection');
    });
}

export async function fetchConnectPlayers(send: (event: GameEvents) => void) {
    try {
        const { players }: ConnectInfo = await connectPlayers();

        const id = client.token;
        // TMP ----- Charger les maps
        send({ type: 'join', id: 'j2', name: players.find(p => p.id !== id)!.name });
        send({ type: 'changeCurrent', id: 'j2' });
        send({ type: 'chooseMap', map: players.find(p => p.id !== id)!.map });
        const location: -1 | 1 = players.findIndex(p => p.id === id) ? 1 : -1;
        send({ type: 'updatePlayer', id: 'j1', location: location });
        send({ type: 'updatePlayer', id: 'j2', location: -location as -1 | 1 });
        send({ type: 'start' });
        console.log('Server: event: connect');
    } catch (error) {
        console.error('Error fetching to connect players:', error);
    }
}

export function startPlayers(): Promise<StartInfo> {
    return new Promise((resolve, _) => {
        client.socket?.on('start', (data: StartInfo) => resolve(data));
        client.socket?.emit('start');
        console.log('Server: emit: start');
    });
}

export async function fetchStartPlayers(context: GameContext, send: (event: GameEvents) => void) {
    try {
        const { current }: StartInfo = await startPlayers();
        const location: -1 | 1 = context.players[0].location as -1 | 1;
        ((location === -1 && current === 0) || (location === 1 && current === 1))
            ? send({ type: 'changeCurrent', id: 'j1' })
            : send({ type: 'changeCurrent', id: 'j2' })
        send({ type: 'start' });
        console.log('Server: event: start');
    } catch (error) {
        console.error('Error fetching to connect players:', error);
    }
}