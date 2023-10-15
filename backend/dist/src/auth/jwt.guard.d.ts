import { CanActivate, ExecutionContext } from '@nestjs/common';
import { CrudService } from './forty-twoapi/crud.service';
export declare class JwtAuthGuard implements CanActivate {
    private readonly crudService;
    private readonly logger;
    constructor(crudService: CrudService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
