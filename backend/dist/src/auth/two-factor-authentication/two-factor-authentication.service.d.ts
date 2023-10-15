import { Response } from 'express';
import { CrudService } from '../forty-twoapi/crud.service';
export declare class TwoFactorAuthenticationService extends CrudService {
    private readonly crud;
    readonly ALGORITHM = "aes-192-cbc";
    private readonly KEY_LENGTH;
    private readonly IV_LENGTH;
    private readonly PASSWORD;
    private key;
    constructor(crud: CrudService);
    encrypt(text: string): string;
    decrypt(text: string): string;
    generateTwoFactorAuthenticationSecret(userId: any): Promise<{
        secret: string;
        otpauthUrl: string;
    }>;
    turnOnTwoFactorAuthentication(userId: number): Promise<void>;
    turnOffAuthentification(userId: number): Promise<void>;
    pipeQrCodeStream(stream: Response, otpauthUrl: string): Promise<any>;
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, twoFactorAuthenticationSecret: string): boolean;
}
