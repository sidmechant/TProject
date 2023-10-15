"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FortyTwoApiController = void 0;
const common_1 = require("@nestjs/common");
const forty_twoapi_service_1 = require("./forty-twoapi.service");
const common_2 = require("@nestjs/common");
const JwtStrategy_1 = require("../../jwt/JwtStrategy");
const axios_1 = require("@nestjs/axios");
const crud_service_1 = require("./crud.service");
const jwt_service_1 = require("../../jwt/jwt.service");
const jsonwebtoken_1 = require("jsonwebtoken");
const public_decorator_1 = require("../public.decorator");
let FortyTwoApiController = class FortyTwoApiController extends forty_twoapi_service_1.FortyTwoApiService {
    constructor(strategy, http, prisma, jwt) {
        super(http, prisma, jwt);
        this.strategy = strategy;
        this.prisma = prisma;
    }
    handleLogin() {
        return { url: process.env.REDIRECT_URL };
    }
    async handleRedirect(req, response) {
        const code = req.query.code;
        try {
            const token = await this.getTokenFortyTwoUser(code).toPromise();
            response.cookie('token', token);
            response.status(200).send(`
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<title>Authentification réussie</title>
					<script type="text/javascript">
						window.onload = function() {
							window.close();
						}
					</script>
				</head>
				<body>
					<p>Authentification réussie, fermeture en cours...</p>
				</body>
				</html>
			`);
        }
        catch (error) {
            console.error('Erreur lors de l\'obtention de l\'access_token:', error);
        }
    }
    async handleTest(req, res) {
        const accessToken = req.cookies.token;
        if (!accessToken) {
            return { error: 'Access Token non valide' };
        }
        try {
            const response = await this.getInformationUser(accessToken, req, res).toPromise();
            if (response && response.data && response.data.id && response.data.login) {
                const responseData = response.data;
                const id = responseData.id;
                const existingJwtToken = req.cookies['jwt_token'];
                if (existingJwtToken) {
                    try {
                        const decoded = (0, jsonwebtoken_1.verify)(existingJwtToken, process.env.JWT_SECRET);
                        if (decoded.sub === id.toString()) {
                            res.clearCookie('jwt_token');
                            res.clearCookie('token');
                            throw new common_2.UnauthorizedException('Déjà connecté. Veuillez vous déconnecter et réessayer.');
                        }
                    }
                    catch (err) {
                    }
                }
                await this.strategy.validate(req, res, id);
                res.send({ message: 'Logged ' });
            }
            else {
                console.error('La structure de la réponse JSON de l\'API 42 est incorrecte.');
            }
            return res;
        }
        catch (error) {
            console.error('Erreur lors de la requête GET vers l\'API 42:', error);
            return { error: 'Erreur lors de la récupération des informations de l\'utilisateur' };
        }
    }
};
exports.FortyTwoApiController = FortyTwoApiController;
__decorate([
    (0, common_1.Get)('login'),
    (0, common_1.Redirect)('http://localhost:3000/42/redirect'),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FortyTwoApiController.prototype, "handleLogin", null);
__decorate([
    (0, common_1.Get)('redirect'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FortyTwoApiController.prototype, "handleRedirect", null);
__decorate([
    (0, common_1.Get)('user'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FortyTwoApiController.prototype, "handleTest", null);
exports.FortyTwoApiController = FortyTwoApiController = __decorate([
    (0, common_1.Controller)('42'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [JwtStrategy_1.JwtStrategy,
        axios_1.HttpService,
        crud_service_1.CrudService,
        jwt_service_1.JwtService])
], FortyTwoApiController);
//# sourceMappingURL=forty-twoapi.controller.js.map