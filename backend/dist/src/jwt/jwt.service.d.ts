export declare class JwtService {
    private readonly jwtSecret;
    constructor();
    createToken(userId: string, sessionId: string): string;
    verifyToken(token: string): void;
    qgenerateUniqueSessionId(userId: string): string;
}
