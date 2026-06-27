import jwt from "jsonwebtoken";
import { config } from "../config";

const jwtSecret = config.jwtSecret as jwt.Secret;
const jwtOptions: jwt.SignOptions = {
  expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
};

export function signToken(payload: { id: string; email: string; roleId?: string | null }) {
  return jwt.sign(payload, jwtSecret, jwtOptions);
}

export function verifyToken(token: string) {
  return jwt.verify(token, jwtSecret) as { id: string; email: string; roleId?: string | null };
}
