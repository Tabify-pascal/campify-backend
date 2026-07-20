import "dotenv/config";
import { SignJWT, jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET;

if (!secret) {
    throw new Error("Authentication is not configured");
}

const secretKey = new TextEncoder().encode(secret);

export type AuthTokenPayload = {
    sub: string;
    email: string;
    role: "admin";
};

export async function createAuthToken(
    payload: AuthTokenPayload
): Promise<string> {
    return new SignJWT({
        email: payload.email,
        role: payload.role,
    })
        .setProtectedHeader({ alg: "HS256"})
        .setSubject(payload.sub)
        .setIssuedAt()
        .setExpirationTime("8h")
        .sign(secretKey);
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload> {
    const { payload } = await jwtVerify(token, secretKey);

    if (
        typeof payload.sub !== "string" || 
        typeof payload.email !== "string" ||
        payload.role !== "admin"
    ) {
        throw new Error("Invalid auth token payload");
    }

    return {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
    };
}