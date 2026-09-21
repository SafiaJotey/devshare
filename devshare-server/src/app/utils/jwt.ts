import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../../config";
import { IJwtPayload } from "../modules/user/user.interface";

export const generateToken = (payload: IJwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.expires_in as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.jwt.secret, options);
};

export const verifyToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.jwt.secret) as IJwtPayload;
};

export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, config.bcrypt_salt_rounds);
};

export const comparePassword = async (plainPassword: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hash);
};
