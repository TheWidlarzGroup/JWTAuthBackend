import express from "express";
import { verifyAccessToken } from "src/Services/Token.Service";
import { prisma } from "@db";
import fetch from "node-fetch";

const UserRouter = express.Router();

UserRouter.get("/me", verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.payload?.user?.userId;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
    res.send(user);
  } catch (error) {
    next(error);
  }
});

UserRouter.get("/frogs", verifyAccessToken, async (_req, res, next) => {
  try {
    const response = await fetch(
      "https://pixabay.com/api/?key=20330556-9d467084be89e92c1e9632c3a&q=frog&image_type=photo"
    );
    res.send(await response.json());
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default UserRouter;
