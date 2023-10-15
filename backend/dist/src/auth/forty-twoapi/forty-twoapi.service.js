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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FortyTwoApiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const rxjs_2 = require("rxjs");
const crud_service_1 = require("./crud.service");
const jwt_service_1 = require("../../jwt/jwt.service");
let FortyTwoApiService = class FortyTwoApiService {
    constructor(http, prisma, jwt) {
        this.http = http;
        this.prisma = prisma;
        this.jwt = jwt;
        this.apiUrl = 'https://api.intra.42.fr';
        this.clientId = process.env.UID;
        this.clientSecret = process.env.SECRET_ID;
        this.UrlApiAccess = "https://api.intra.42.fr/oauth/token";
        this.CallbackUrl = "http://localhost:3000/42/redirect";
    }
    async createUserFromResponse(responseData) {
        const createPrismCrudDto = {
            id: responseData.id,
            username: responseData.login,
            displayname: responseData.displayname,
            lastname: responseData.last_name,
            firstname: responseData.first_name,
            emails: responseData.email,
            phoneNumbers: responseData.phone,
        };
        const user = await this.prisma.createUser(createPrismCrudDto);
        if (!user) {
            throw new common_1.BadRequestException('Erreur lors de la création de l\'utilisateur');
        }
        return user;
    }
    postGeneratetwoAuthentification(id) {
        console.log("POST GENERATE");
        return this.http.post('http://localhost:3000/2fa/generate', { id: id }).pipe((0, rxjs_1.catchError)((error) => {
            console.error('Error requête post 2fa/generate:', error);
            return (0, rxjs_2.throwError)(() => new common_1.ForbiddenException('Erreur lors de la requête POST'));
        }));
    }
    getTokenFortyTwoUser(code) {
        const data = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: this.CallbackUrl,
        };
        console.log("CLIENT ID", this.clientId);
        console.log("CLIENT SECRET", this.clientSecret);
        console.log("code", code);
        console.log("REDIRECT", this.CallbackUrl);
        return this.http
            .post(this.UrlApiAccess, data)
            .pipe((0, rxjs_1.map)((response) => {
            if (response.data && response.data.access_token) {
                console.log('Access Token récupéré avec succès:', response.data.access_token);
                return response.data.access_token;
            }
            else {
                console.log("PAS DE REPONSE DE LA  PART DE L API DE 42");
                console.error('Réponse de l\'API 42 incomplète ou sans access_token:', response.data);
                throw new common_1.ForbiddenException('Réponse de l\'API 42 incomplète ou sans access_token');
            }
        }), (0, rxjs_1.catchError)((error) => {
            console.error('Erreur lors de la requête POST:', error);
            return (0, rxjs_2.throwError)(() => new common_1.ForbiddenException('Erreur lors de la requête POST'));
        }));
    }
    getInformationUser(accessToken, req, res) {
        console.log("Debug acess token ", accessToken);
        const data = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
        return this.http.get('https://api.intra.42.fr/v2/me', data)
            .pipe((0, rxjs_1.mergeMap)(async (response) => {
            console.log("Debug OKOKOKOK");
            if (response) {
                try {
                    console.log("Avant .....");
                    const user = await this.createUserFromResponse(response.data);
                    return response;
                }
                catch (e) {
                    console.log('Error RESPONSE FROM AXIOS 42', e);
                }
            }
        }), (0, rxjs_1.catchError)((error) => {
            console.log(`chien => ${error}`);
            return (0, rxjs_2.throwError)(() => new common_1.ForbiddenException('Erreur lors de la requête GET'));
        }));
    }
    async signout(req, res) {
        res.clearCookie('token');
        res.clearCookie('jwt_token');
        return res.send({ message: "Signout Bye bye" });
    }
};
exports.FortyTwoApiService = FortyTwoApiService;
exports.FortyTwoApiService = FortyTwoApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService, crud_service_1.CrudService, jwt_service_1.JwtService])
], FortyTwoApiService);
//# sourceMappingURL=forty-twoapi.service.js.map