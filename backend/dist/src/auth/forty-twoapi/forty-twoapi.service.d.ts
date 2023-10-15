import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { CrudService } from './crud.service';
import { JwtService } from '../../jwt/jwt.service';
import { Request, Response } from 'express';
export declare class FortyTwoApiService {
    private http;
    protected readonly prisma: CrudService;
    private jwt;
    private readonly apiUrl;
    private readonly clientId;
    private readonly clientSecret;
    private readonly UrlApiAccess;
    private readonly CallbackUrl;
    constructor(http: HttpService, prisma: CrudService, jwt: JwtService);
    private createUserFromResponse;
    postGeneratetwoAuthentification(id: Number): Observable<any>;
    getTokenFortyTwoUser(code: string): Observable<string>;
    getInformationUser(accessToken: string, req: Request, res: Response): Observable<AxiosResponse<any, any>>;
    signout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
