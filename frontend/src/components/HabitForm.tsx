import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { Habit } from "../types/habit";

interface Props {
  onAdd: (habit: Habit) => void;
}

export default function HabitForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title.trim()) return toast.error("Please enter a title");
    try {
      setLoading(true);
      const res = await api.post("/api/habits", { title: title.trim(), description: description.trim(), frequency });
      onAdd(res.data);
      setTitle(""); setDescription(""); setFrequency("daily");
      toast.success("Habit added");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to add habit");
    } finally { setLoading(false); }
  };

  return (
    <div className="card p-5">
      <div className="flex flex-col md:flex-row gap-4">
        <input className="input" placeholder="Add a habit ..." value={title} onChange={(e)=>setTitle(e.target.value)} />
        <select className="input w-40" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <textarea className="input mt-3" placeholder="Short note (optional)" rows={2} value={description} onChange={(e)=>setDescription(e.target.value)} />

      <div className="flex justify-end mt-3">
        <button disabled={loading} onClick={submit} className="btn-primary">
          {loading ? "Adding..." : "Add Habit"}
        </button>
      </div>
    </div>
  );
}
