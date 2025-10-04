import Navbar from "../components/Navbar";
import HabitForm from "../components/HabitForm";
import HabitCard from "../components/HabitCard";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { Habit } from "../types/habit";
import api from "../utils/api";
import { getToken } from "../utils/auth";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) router.push("/");
    else fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await api.get("/api/habits");
      setHabits(res.data);
    } catch (err) {
      toast.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  const addHabit = (h: Habit) => setHabits((prev) => [h, ...prev]);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <main className="container h-[90vh] py-8">
        <div className="flex flex-col md:flex-row justify-evenly gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">My Habits</h2>
            <p className="text-sm text-slate-500 mb-4">
              Track your streaks - stay consistent.
            </p>
            <div className="flex flex-col gap-4">
              {habits.length === 0 && (
                <div className="text-slate-500">No habits yet - add one.</div>
              )}
              {habits.map((h) => (
                <HabitCard key={h.id} habit={h} onHabitUpdate={fetchHabits} />
              ))}
            </div>
          </div>

          <aside>
            <div className="card p-4 mb-4">
              <h3 className="font-semibold">Add new habit</h3>
              <p className="text-sm text-slate-500 mb-3">
                Create a habit and keep your streak alive.
              </p>
              <HabitForm onAdd={addHabit} />
            </div>

            <div className="card p-4">
              <h4 className="font-semibold mb-2">Tips</h4>
              <ul className="text-sm text-slate-600 list-disc list-inside">
                <li>Start small — 1 habit at a time</li>
                <li>Use daily frequency for best streaks</li>
                <li>Complete habits consistently</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
