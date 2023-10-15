"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatechannelException = exports.channelNotFoundException = exports.channelExistsException = void 0;
const common_1 = require("@nestjs/common");
class channelExistsException extends common_1.HttpException {
    constructor() {
        super('Channel already exists', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.channelExistsException = channelExistsException;
class channelNotFoundException extends common_1.HttpException {
    constructor() {
        super('Channel not found', common_1.HttpStatus.NOT_FOUND);
    }
}
exports.channelNotFoundException = channelNotFoundException;
class CreatechannelException extends common_1.HttpException {
    constructor(message) {
        super(message, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.CreatechannelException = CreatechannelException;
//# sourceMappingURL=channel.exceptions.js.map