import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { CrudService } from './forty-twoapi/crud.service';
import { Public } from './public.decorator';
import { decode } from 'punycode';



@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger: Logger = new Logger('JwtAuthGuard');

  constructor(private readonly crudService: CrudService) { } // Injectez le CrudService

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    this.logger.debug(` JWT GUARD ACTIVATED `);

    const isPublic = Reflect.getMetadata('isPublic', context.getHandler());
    if (isPublic) {
      console.log("ROUTE PUBLIQUE");
      return true; // Autoriser l'accès sans vérification JWT
    }

    this.logger.debug(` JWT GENERADATA ${isPublic} `);
    try {
      const cookie = request.cookies['jwt_token'];
      if (!cookie) {
        res.clearCookie('token');
        throw new UnauthorizedException('No token provided');
      }

      this.logger.debug(`JWT COOKIE ${cookie}`);
      const decoded = verify(cookie, process.env.JWT_SECRET) as JwtPayload;
      if (!decoded || !decoded.sub || !decoded.sessionId) {
        res.clearCookie('jwt_token');
        res.clearCookie('token');
        console.log('PREMIERE ERREUR');
        this.logger.error(`UnauthorizedException decoded.sub ${decoded.sub} decoded session ${decoded.sessionId}`);
        throw new UnauthorizedException('Invalid token');
      }


      //this.logger.debug(`JWT ${decode} `);
      // Vérifiez le sessionId avec la base de données
      const user = await this.crudService.findUserById(Number(decoded.sub)); // Supposons que vous ayez une méthode comme celle-ci dans votre CrudService
      if (user.sessionId !== decoded.sessionId) {
        res.clearCookie('jwt_token');
        res.clearCookie('token');
        this.logger.error(`UnauthorizedException   decode session ${decoded.sessionId} user session ${user.sessionId}`);
        throw new UnauthorizedException('Logged in from another session');
      }

      //request.user = user;
      request.userId = decoded.sub;
      this.logger.debug(`JWT FINISH user : ${user.id} ${request.id}`);
      return true;
    } catch (err) {
       console.log("PROBLEM GUARD: ", err);
      return false;
    }
  }
}

