import "express-async-errors";
import "@/db/connect";
import express, { ErrorRequestHandler } from "express";
import authRouter from "./routes/auth";
import { errorHandler } from "./middlewares/error";

const app = express();

// app.use((req, res, next) => {
//   req.on("data", (chunk) => {
//     req.body = JSON.parse(chunk);
//     next();
//   });
// });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.post("/test", (req, res) => {
  console.log(req.body);
  res.json({});
});

app.use(errorHandler);

const port = process.env.PORT || 8989;

app.listen(port, () => {
  console.log(`The application is running on port http://localhost:${port}`);
});
