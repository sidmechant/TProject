import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CrudService } from '../forty-twoapi/crud.service';
export declare class RolesGuard implements CanActivate {
    private readonly reflector;
    private readonly crudService;
    constructor(reflector: Reflector, crudService: CrudService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
