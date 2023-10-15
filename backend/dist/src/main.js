"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const common_1 = require("@nestjs/common");
dotenv.config();
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.use(cookieParser());
        app.enableCors({
            origin: 'http://localhost:5173',
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe());
        await app.listen(3000);
    }
    catch (error) {
        console.log("Error in main:", error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map