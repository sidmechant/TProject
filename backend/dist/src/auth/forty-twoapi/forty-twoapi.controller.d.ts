import { FortyTwoApiService } from './forty-twoapi.service';
import { JwtStrategy } from "../../jwt/JwtStrategy";
import { HttpService } from '@nestjs/axios';
import { CrudService } from "./crud.service";
import { JwtService } from "../../jwt/jwt.service";
import { Response } from 'express';
export declare class FortyTwoApiController extends FortyTwoApiService {
    private readonly strategy;
    protected prisma: CrudService;
    constructor(strategy: JwtStrategy, http: HttpService, prisma: CrudService, jwt: JwtService);
    handleLogin(): {
        url: string;
    };
    handleRedirect(req: any, response: Response): Promise<void>;
    handleTest(req: any, res: Response): Promise<Response<any, Record<string, any>> | {
        error: string;
    }>;
}
