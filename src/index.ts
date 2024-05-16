import express from "express";
import authRouter from "./routes/auth";

const app = express();

app.use("/auth", authRouter);

const port = process.env.PORT || 8989;

app.listen(port, () => {
  console.log(`The application is running on port http://localhost:${port}`);
});
