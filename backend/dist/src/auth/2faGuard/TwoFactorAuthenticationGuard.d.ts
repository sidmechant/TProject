import { CanActivate, ExecutionContext } from '@nestjs/common';
import { CrudService } from '../forty-twoapi/crud.service';
export declare class TwoFactorAuthenticationGuard implements CanActivate {
    private readonly crudService;
    constructor(crudService: CrudService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
