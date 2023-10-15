import { HttpException } from '@nestjs/common';
export declare class channelExistsException extends HttpException {
    constructor();
}
export declare class channelNotFoundException extends HttpException {
    constructor();
}
export declare class CreatechannelException extends HttpException {
    constructor(message: string);
}
