/**
 * @file password.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-16
 */

import {
    randomBytes,
    scrypt as scryptCallback,
    timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;

/**
 * Hashes a password using scrypt and a randomly generated salt.
 *
 * @param password - Plain-text password to hash.
 * @returns The salt and derived password hash in hexadecimal format.
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");

    const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

    return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verifies a password against a previously stored password hash.
 *
 * @param password - Plain-text password to verify.
 * @param storedPasswordHash - Stored salt and password hash.
 * @returns True if the password matches, otherwise false.
 */
export async function verifyPassword(
    password: string,
    storedPasswordHash: string,
): Promise<boolean> {
    const [salt, storedKeyHex] = storedPasswordHash.split(":");

    if (!salt || !storedKeyHex) {
        return false;
    }

    const storedKey = Buffer.from(storedKeyHex, "hex");

    if (storedKey.length !== KEY_LENGTH) {
        return false;
    }

    const derivedKey = (await scrypt(
        password,
        salt,
        storedKey.length,
    )) as Buffer;

    if (storedKey.length !== derivedKey.length) {
        return false;
    }

    return timingSafeEqual(storedKey, derivedKey);
}
