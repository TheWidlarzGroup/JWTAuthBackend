import express, { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import morgan from "morgan";
import AuthRouter from "./Controllers/Auth.Controller";
import { initDb, prisma } from "./db";
import { ErrorType } from "./types";
import { verifyAccessToken } from "./Services/Token.Service";
require("dotenv").config();

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// +++++++++++
/* ROUTERS */
// ++++++++
app.use("/auth", AuthRouter);

app.get("/", verifyAccessToken, async (req, res, _next) => {
  console.log(req.payload?.user?.userId);
  const userId = req.payload?.user?.userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  res.send(user);
});

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
