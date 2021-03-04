import express, { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import morgan from "morgan";
import AuthRouter from "./Controllers/Auth.Controller";
import { initDb } from "./db";
import { ErrorType } from "./types";
import UserRouter from "./Controllers/User.Controller";
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: " http://localhost:3000/",
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// +++++++++++
/* ROUTERS */
// ++++++++
app.use("/auth", AuthRouter);

app.use(UserRouter);

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

const PORT = process.env.PORT || 3001;

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
