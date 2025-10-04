"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../utils/db");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Get all habits for logged-in user
router.get("/", auth_1.authenticate, async (req, res) => {
    try {
        const result = await db_1.pool.query("SELECT * FROM habits WHERE user_id=$1 ORDER BY created_at DESC", [req.userId]);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
// Create a new habit
router.post("/", auth_1.authenticate, async (req, res) => {
    const { title, description, frequency } = req.body;
    if (!title)
        return res.status(400).json({ error: "Title is required" });
    try {
        const result = await db_1.pool.query("INSERT INTO habits (user_id, title, description, frequency) VALUES ($1, $2, $3, $4) RETURNING *", [req.userId, title, description || null, frequency || null]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
// Update habit
router.put("/:id", auth_1.authenticate, async (req, res) => {
    const { id } = req.params;
    const { title, description, frequency } = req.body;
    try {
        const result = await db_1.pool.query(`UPDATE habits SET title=$1, description=$2, frequency=$3, updated_at=NOW() 
       WHERE id=$4 AND user_id=$5 RETURNING *`, [title, description, frequency, id, req.userId]);
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Habit not found" });
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
// Delete habit
router.delete("/:id", auth_1.authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db_1.pool.query("DELETE FROM habits WHERE id=$1 AND user_id=$2 RETURNING *", [id, req.userId]);
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Habit not found" });
        res.json({ message: "Habit deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
// Mark habit as completed (update streak)
router.patch("/:id/complete", auth_1.authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const habitResult = await db_1.pool.query("SELECT * FROM habits WHERE id=$1 AND user_id=$2", [id, req.userId]);
        if (habitResult.rows.length === 0)
            return res.status(404).json({ error: "Habit not found" });
        const habit = habitResult.rows[0];
        const today = new Date();
        const lastCompleted = habit.last_completed ? new Date(habit.last_completed) : null;
        let newStreak = 1;
        if (lastCompleted) {
            const diff = Math.floor((today.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24));
            if (diff === 1)
                newStreak = habit.streak + 1;
        }
        const result = await db_1.pool.query("UPDATE habits SET streak=$1, last_completed=NOW(), updated_at=NOW() WHERE id=$2 RETURNING *", [newStreak, id]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
exports.default = router;
