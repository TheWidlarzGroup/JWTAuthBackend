import express from "express";
import { login, logout, refreshToken, register } from "src/Services/Auth.Service";

const AuthRouter = express.Router();

AuthRouter.get("/me", async (req, res, next) => {
  try {
    const result = await register(req.body);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

export default AuthRouter;
