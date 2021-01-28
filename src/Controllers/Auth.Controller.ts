import express from "express";
import { login, logout, refreshToken, register } from "src/Services/Auth.Service";

const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res, next) => {
  try {
    const result = await register(req.body);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

AuthRouter.post("/login", async (req, res, next) => {
  try {
    const result = await login(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

AuthRouter.post("/refresh-token", async (req, res, next) => {
  try {
    const result = await refreshToken(req.body);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

AuthRouter.delete("/logout", async (req, res, next) => {
  try {
    const result = await logout(req.body);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

export default AuthRouter;
