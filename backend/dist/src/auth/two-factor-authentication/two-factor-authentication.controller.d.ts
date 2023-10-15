import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { Response } from 'express';
import { CrudService } from '../forty-twoapi/crud.service';
import { TurnOnTwoFactorAuthDto } from './two-factor-authentification.dto';
export declare class TwoFactorAuthenticationCodeDto {
    readonly twoFactorAuthenticationCode: string;
}
export declare class TwoFactorAuthenticationController extends CrudService {
    private readonly twoFactorAuthenticationService;
    private readonly crud;
    constructor(twoFactorAuthenticationService: TwoFactorAuthenticationService, crud: CrudService);
    register(req: any, response: Response): Promise<void>;
    turnOnTwoFactorAuthentication(req: any, response: Response, twoFactorAuthCodeDto: TurnOnTwoFactorAuthDto): Promise<{
        statusCode: number;
        message: string;
        isSuccess: boolean;
    }>;
    updatebool(req: any, response: Response): Promise<Response<any, Record<string, any>> | {
        statusCode: number;
        message: string;
        isSuccess: boolean;
    }>;
}
