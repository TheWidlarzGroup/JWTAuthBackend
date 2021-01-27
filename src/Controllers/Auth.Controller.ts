import express from "express";

const AuthRouter = express.Router();

AuthRouter.post("/register", async (_req, res, _next) => {
  res.send("register route");
});

AuthRouter.post("/login", async (_req, res, _next) => {
  res.send("login route");
});

AuthRouter.post("/refresh-token", async (_req, res, _next) => {
  res.send("refresh token route");
});

AuthRouter.delete("/logout", async (_req, res, _next) => {
  res.send("logout route");
});

export default AuthRouter;
