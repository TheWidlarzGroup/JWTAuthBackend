import express from "express";
import { login, logout, refreshToken, register } from "src/Services/Auth.Service";

const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res, next) => {
  try {
    const result = await register(req.body);
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    res.cookie("refresh_token", result.refreshToken, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: false });
    res.send({ accessToken: result.accessToken });
  } catch (error) {
    next(error);
  }
});

AuthRouter.post("/login", async (req, res, next) => {
  try {
    const result = await login(req.body);
    res.cookie("refresh_token", result.refreshToken, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: false });

    res.send({ accessToken: result.accessToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

AuthRouter.post("/refresh-token", async (req, res, next) => {
  try {
    const result = await refreshToken({ refreshToken: req.cookies.refresh_token });
    res.cookie("refresh_token", result.refreshToken, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: false });
    res.send({ accessToken: result.accessToken });
  } catch (error) {
    next(error);
  }
});

AuthRouter.delete("/logout", async (req, res, next) => {
  try {
    console.log(req.cookies);
    const result = await logout({ refreshToken: req.cookies.refresh_token });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

export default AuthRouter;
