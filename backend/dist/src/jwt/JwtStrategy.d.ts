import { Strategy } from 'passport-custom';
import { JwtService } from '../jwt/jwt.service';
import { Request, Response } from 'express';
import { CrudService } from 'src/auth/forty-twoapi/crud.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly jwtService;
    private readonly crudService;
    constructor(jwtService: JwtService, crudService: CrudService);
    validate(request: Request, response: Response, id: string): Promise<void>;
    private authenticateUser;
}
export {};
