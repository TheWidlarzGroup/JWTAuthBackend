import express from "express";
import { verifyAccessToken } from "src/Services/Token.Service";
import { prisma } from "@db";

const UserRouter = express.Router();

UserRouter.use(verifyAccessToken);

UserRouter.get("/me", async (req, res, next) => {
  try {
    const userId = req.payload?.user?.userId;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
    res.send(user);
  } catch (error) {
    next(error);
  }
});

export default UserRouter;
