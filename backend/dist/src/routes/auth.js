"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../utils/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
// Register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ error: "All fields are required" });
    try {
        // Check if user exists
        const existing = await db_1.pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (existing.rows.length > 0)
            return res.status(400).json({ error: "Email already exists" });
        // Hash password
        const salt = await bcrypt_1.default.genSalt(10);
        const hashed = await bcrypt_1.default.hash(password, salt);
        // Insert user
        const result = await db_1.pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at", [name, email, hashed]);
        const user = result.rows[0];
        // Generate token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.json({ token, user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "All fields are required" });
    try {
        const result = await db_1.pool.query("SELECT * FROM users WHERE email=$1", [
            email,
        ]);
        if (result.rows.length === 0)
            return res.status(400).json({ error: "Invalid credentials" });
        const user = result.rows[0];
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
exports.default = router;
