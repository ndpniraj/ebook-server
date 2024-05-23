import "express-async-errors";
import "@/db/connect";
import express, { ErrorRequestHandler } from "express";
import path from "path";

import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import { errorHandler } from "./middlewares/error";
import { fileParser } from "./middlewares/file";
import authorRouter from "./routes/author";
import bookRouter from "./routes/book";

const app = express();

const publicPath = path.join(__dirname, "./books");

// app.use((req, res, next) => {
//   req.on("data", (chunk) => {
//     req.body = JSON.parse(chunk);
//     next();
//   });
// });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/books", express.static(publicPath));

app.use("/auth", authRouter);
app.use("/author", authorRouter);
app.use("/book", bookRouter);

app.post("/test", fileParser, (req, res) => {
  console.log(req.files);
  console.log(req.body);
  res.json({});
});

app.use(errorHandler);

const port = process.env.PORT || 8989;

app.listen(port, () => {
  console.log(`The application is running on port http://localhost:${port}`);
});
