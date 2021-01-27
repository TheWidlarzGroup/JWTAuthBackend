import { prisma } from "@db";
import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import JWT from "jsonwebtoken";

export const signAccessToken = (userId: number, userEmail: string) => {
  return new Promise((resolve, reject) => {
    const payload = {
      user: { userId, userEmail },
    };
    const secret = process.env.ACCESS_TOKEN_SECRET || "RandomToken";
    const options = {
      expiresIn: "5m",
      audience: `${userId}`,
    };
    JWT.sign(payload, secret, options, async (err, token) => {
      if (err) {
        console.log(err.message);
        reject(new createError.InternalServerError());
        return;
      }
      await prisma.user.update({ where: { id: userId }, data: { access_token: token } });

      resolve(token);
    });
  });
};

export const verifyAccessToken = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.headers["authorization"]) return next(new createError.Unauthorized());
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET || "RandomToken", (err, payload) => {
    if (err) {
      const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(new createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
};

export const signRefreshToken = (userId: number, userEmail: string) =>
  new Promise((resolve, reject) => {
    const payload = {
      user: { userId, userEmail },
    };
    const secret = process.env.REFRESH_TOKEN_SECRET || "RandomRefreshToken";
    const options = {
      expiresIn: "1y",
      audience: `${userId}`,
    };
    JWT.sign(payload, secret, options, async (err, token) => {
      if (err) {
        console.log(err.message);
        reject(new createError.InternalServerError());
      }
      await prisma.user.update({ where: { id: userId }, data: { refresh_token: token } });
      resolve(token);
    });
  });

export const verifyRefreshToken = (refreshToken: string) =>
  new Promise((resolve, reject) => {
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "RandomRefreshToken", async (err, payload: any) => {
      if (err) return reject(new createError.Unauthorized());
      const userId: number | undefined = payload.aud;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        reject(new createError.Unauthorized());
      }
      if (refreshToken === user?.refresh_token) return resolve(userId);
      reject(new createError.Unauthorized());
    });
  });
