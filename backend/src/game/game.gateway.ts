import { UnauthorizedException, NotFoundException} from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { Player as PlayerMachine } from './types/machine';
import { Player as PlayerPhisic } from './types/physics';
import { MatchMaking } from './MatchMaking';
import * as jwt from 'jsonwebtoken';
import { CrudService } from 'src/auth/forty-twoapi/crud.service';
import { sign, verify } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';


const match: MatchMaking = new MatchMaking;
@WebSocketGateway( {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
// @WebSocketGateway(3000, {
//   namespace: 'game',
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// })


export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly crudService: CrudService) {}
  @WebSocketServer() server: Server;

//   extractJwtToken(client: Socket): string {
//     const cookies = client.handshake.headers.cookie;
//     if (!cookies) {
//         throw new UnauthorizedException('No cookies provided.');
//     }
//     const jwtCookie = cookies.split(';').find(c => c.trim().startsWith('jwt_token='));
//     console.log("EXCTRACT GAME  COOOOKIES", jwtCookie)
//     if (!jwtCookie) {
//         throw new UnauthorizedException('JWT token is missing in the cookies.');
//     }
//     return jwtCookie.split('=')[1];
// }


//   getUserIdByToken(token: string): { sub: string, sessionId: string } {
//     const jwtSecret = process.env.JWT_SECRET;
//     if (!jwtSecret)
//       throw new UnauthorizedException('JWT secret is not configured.');
//     try {
//       const decoded = jwt.verify(token, jwtSecret) as { sub: string, sessionId: string };
//       if (!decoded || !decoded.sub || typeof decoded.sub !== 'string' || !decoded.sessionId || typeof decoded.sessionId !== 'string')
//         throw new Error('Invalid token payload');
//       return { sub: decoded.sub, sessionId: decoded.sessionId };
//     } catch (error) {
//       throw new UnauthorizedException('Invalid JWT token.');
//     }
// }

// async handleConnection(client: Socket) {
//   try {
//     const token = this.extractJwtToken(client); 
//     const { sub, sessionId } = this.getUserIdByToken(token); 

//     const user = await this.crudService.findUserById(Number(sub));
//     if (!user) {
//       console.log("ERROR1");
//       throw new NotFoundException('User not found in the database.');
//     }

//     if (user.sessionId !== sessionId) {
//       throw new UnauthorizedException('Logged in from another session');
//     }

//     console.log('Client connected with userId:', sub);
//   } catch (error) {
//     console.error('Error during client connection:', error.message);
//     client.disconnect(true);
//   }
// }
  /**
  * Récupère le token JWT de la requête de connexion du client.
  * @param {Socket} client - L'objet Socket représentant le client.
  * @returns {string} - Le token JWT s'il est présent.
  * @throws {UnauthorizedException} - Si le token JWT n'est pas trouvé dans la requête de connexion.
  */
  // extractJwtToken(client: Socket): string {
  //   if (!client.handshake.query || !client.handshake.query.token)
  //     throw new UnauthorizedException('JWT token is missing in the connection request.');
  //   return client.handshake.query.token as string;
  // }

  // /**
  // * Vérifie la validité d'un token JWT en extrait le userId;
  // * @param {string} token - Le token JWT à vérifier.
  // * @returns {object} - Le payload du token JWT contnant le userId décodé si le token est valide.
  // * {
  // *   userId: "1985"
  // * }
  // * @throws {UnauthorizedException} - Si le token n'est pas valide ou si le secret JWT n'est pas configuré.
  // */
  getUserIdByToken(token: string): { userId: string } {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret)
      throw new UnauthorizedException('JWT secret is not configured.');
    try {
      console.log("Debug: ", token);
      const decoded = jwt.verify(token, jwtSecret) as { userId: string };
      if (!decoded || !decoded.userId || typeof decoded.userId !== 'string')
        throw new Error('Invalid token payload');
      return { userId: decoded.userId };
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token.');
    }
  }

  handleConnection(client: Socket) {
    const token = client.handshake.query.token as string; // TMP
    console.log('Client connected:', token);
  }
  // async handleConnection(client: Socket) {
  //   try {
  //     const token = client.handshake.query.token as string; 
  //     if (!token) {
  //       console.error('No token provided.');
  //       client.disconnect(true);
  //       return;
  //     }
  
  //     console.log('Client connected with token:', token);
  //     const { userId } = this.getUserIdByToken(token); 
  
  //     const user = await this.crudService.findUserById(Number(userId));
  //     if (!user) {
  //       console.error('User not found in the database.');
  //       client.disconnect(true);
  //       return;
  //     }
  
      // const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      // if (user.sessionId !== decoded.sessionId) {
      //   console.error('Logged in from another session.');
      //   client.disconnect(true);
      //   return;
      // }
  
  //     console.log('Client authenticated with userId:', userId);
  //   } catch (error) {
  //     console.error('Error during client connection:', error.message);
  //     client.disconnect(true);
  //   }
  // }
  

  handleDisconnect(client: Socket) {
    match.remove(client);
    const token = client.handshake.query.token as string; // TMP
    console.log('Client disconnected:', token);
  }

  @SubscribeMessage('ball')
  handleEventBall(@ConnectedSocket() client: Socket): void {
    match.getRoom(client).ball(client);
    // console.log('Client', token, ': event: ball');
  }

  @SubscribeMessage('chooseMap')
  handleEventChooseMap(@ConnectedSocket() client: Socket, @MessageBody() data: { map: PlayerMachine['map'] }): void {
    match.getRoom(client).chooseMap(client, data.map);
    const token = client.handshake.query.token as string; // TMP
    console.log('Client', token, ': event: chooseMap', data.map);
  }

  @SubscribeMessage('connection')
  handleEventConnect(@ConnectedSocket() client: Socket) {
    match.getRoom(client).connect();
    const token = client.handshake.query.token as string; // TMP
    console.log('Client', token, ': event: connection');
  }

  @SubscribeMessage('join')
  handleEventJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { name: PlayerMachine['name'] }): void {
    match.add(client);
    const token = client.handshake.query.token as string; // TMP
    console.log('Client', token, ': event: join');
  }

  @SubscribeMessage('leave')
  handleEventLeave(@ConnectedSocket() client: Socket): void {
    match.remove(client);
    const token = client.handshake.query.token as string; // TMP
    console.log('Client', token, ': event: leave');
  }

  @SubscribeMessage('move')
  handleEventMove(@ConnectedSocket() client: Socket, @MessageBody() data: { key: PlayerPhisic['key'] & { ulti: boolean, power: boolean } }): void {
    match.getRoom(client).move(client, data.key);
    // console.log('Client', token, ': event: move');
  }

  @SubscribeMessage('players')
  handleEventPlayers(@ConnectedSocket() client: Socket): void {
    match.getRoom(client).player(client);
    // console.log('Client', token, ': event: players');
  }

  @SubscribeMessage('restart')
  handleEventRestart(@ConnectedSocket() client: Socket): void {
    match.getRoom(client).restart();
    match.merge();
    const token = client.handshake.query.token as string; // TMP
    console.log('Client', token, ': event: restart');
  }

  @SubscribeMessage('start')
  handleEventStart(@ConnectedSocket() client: Socket) {
    match.getRoom(client).start(client);
    const token = client.handshake.query.token as string; // TMP
    console.log('Client', token, ': event: start');
  }

  @SubscribeMessage('play')
  handleEventPlay(@ConnectedSocket() client: Socket) {
    match.getRoom(client).play(client);
    const token = client.handshake.query.token as string; // TMP
    console.log('Client', token, ': event: play');
  };

  @SubscribeMessage('skillInfo')
  handleEventSkillInfo(@ConnectedSocket() client: Socket) {
    match.getRoom(client).skillInfo(client);
    const token = client.handshake.query.token as string; // TMP
    // console.log('Client', token, ': event: skillInfo');
  }
}
