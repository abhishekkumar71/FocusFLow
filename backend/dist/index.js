"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./src/utils/db");
const habits_1 = __importDefault(require("./src/routes/habits"));
const auth_1 = __importDefault(require("./src/routes/auth"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000","https://focus-f-low-omega.vercel.app/"],
    credentials: true,
}));
app.use("/api/habits", habits_1.default);
app.use("/api/user", auth_1.default);
app.get("/", (req, res) => {
    res.send("Hello...");
});
app.get("/test-db", async (req, res) => {
    const result = await db_1.pool.query("SELECT NOW()");
    res.json(result.rows[0]);
});
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
