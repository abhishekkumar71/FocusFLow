import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { pool } from "./utils/db";
import habitsRouter from "./routes/habits";
import userRouter from "./routes/auth";
import cors from "cors";



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use("/api/habits", habitsRouter);
app.use("/api/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello...");
});

app.get("/test-db", async (req: Request, res: Response) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows[0]);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
