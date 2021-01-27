import express, { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import morgan from "morgan";
import AuthRouter from "./Controllers/Auth.Controller";
import { initDb } from "./db";
import { ErrorType } from "./types";
import { prisma } from "@db";
require("dotenv").config();

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", async (_req, res, _next) => {
  const response = await prisma.user.findFirst({ rejectOnNotFound: true });
  console.log(response);
  res.send(response);
});

// +++++++++++
/* ROUTERS */
// ++++++++
app.use("/auth", AuthRouter);

// ++++++++++++++++++
/* ERROR HANDLERS */
// ++++++++++++++++
app.use(async (_req, _res, next) => {
  next(new createError.NotFound("This route does not exist"));
});
app.use(async (err: ErrorType, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

// Init db connection + init express server.
(async () => {
  try {
    const dbResponse = await initDb();
    console.log(dbResponse);
    app.listen(PORT, () => {
      console.log("Server has been started!");
    });
  } catch (error) {
    throw new Error(error);
  }
})();
