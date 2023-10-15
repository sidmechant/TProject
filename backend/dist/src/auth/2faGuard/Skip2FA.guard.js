"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skip2FAGuard = exports.SKIP_2FA_GUARD_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.SKIP_2FA_GUARD_KEY = 'skip2faGuard';
const Skip2FAGuard = () => (0, common_1.SetMetadata)(exports.SKIP_2FA_GUARD_KEY, true);
exports.Skip2FAGuard = Skip2FAGuard;
//# sourceMappingURL=Skip2FA.guard.js.map