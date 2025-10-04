import { useState } from "react";
import { Habit } from "../types/habit";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import { PencilIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";

interface Props {
  habit: Habit;
  onHabitUpdate?: () => void;
}

export default function HabitCard({ habit, onHabitUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(habit.title);
  const [description, setDescription] = useState(habit.description || "");
  const [frequency, setFrequency] = useState(habit.frequency || "daily");

  const complete = async () => {
    try {
      setLoading(true);
      await api.patch(`/api/habits/${habit.id}/complete`);
      toast.success("Marked complete");
      onHabitUpdate?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to complete");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete habit?")) return;
    try {
      setLoading(true);
      await api.delete(`/api/habits/${habit.id}`);
      toast.success("Deleted");
      onHabitUpdate?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!title.trim()) return toast.error("Title required");
    try {
      setLoading(true);
      await api.put(`/api/habits/${habit.id}`, {
        title: title.trim(),
        description: description.trim(),
        frequency,
      });
      toast.success("Updated");
      setEditing(false);
      onHabitUpdate?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="flex-1">
        {!editing ? (
          <>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">{habit.title}</h3>
              <div className="text-sm text-slate-400">
                {new Date(habit.created_at || Date.now()).toLocaleDateString()}
              </div>
            </div>
            <p className="mt-1 text-sm text-slate-600">{habit.description}</p>
            <div className="mt-3 text-xs text-slate-500">
              Streak: <span className="font-medium">{habit.streak || 0}</span> •{" "}
              {habit.frequency || "daily"}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="input w-44"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}
      </div>

<div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
        {!editing ? (
          <>
            <button
              onClick={complete}
              disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              <CheckIcon className="w-4 h-4" /> Complete
            </button>
            <button
              onClick={() => setEditing(true)}
              className="btn btn-ghost flex items-center gap-2"
            >
              <PencilIcon className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={remove}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2"
            >
              <TrashIcon className="w-4 h-4" /> Delete
            </button>
          </>
        ) : (
          <>
            <button onClick={save} className="btn-primary">
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setTitle(habit.title);
                setDescription(habit.description || "");
                setFrequency(habit.frequency || "daily");
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
