import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { getToken, removeToken } from "../utils/auth";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import api from "../utils/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Habit {
  id: number;
  title: string;
  streak: number;
  last_completed: string | null;
}

export default function Navbar() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setToken(getToken());

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [router.pathname]);

  const logout = () => {
    removeToken();
    setToken(null);
    router.push("/");
  };

  const toggleDropdown = async () => {
    setShowDropdown((prev) => !prev);

    if (!user) {
      try {
        const res = await api.get("/api/user/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    if (!habits.length) {
      try {
        const res = await api.get("/api/habits");
        setHabits(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
  const longestStreak = habits.length
    ? Math.max(...habits.map((h) => h.streak || 0))
    : 0;
  const todayStr = new Date().toDateString();
  const habitsToday = habits.filter(
    (h) =>
      h.last_completed && new Date(h.last_completed).toDateString() === todayStr
  ).length;

  return (
    <header className="bg-white/90 backdrop-blur sticky top-0 z-50 border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            FF
          </div>
          <div>
            <div className="text-lg font-semibold">FocusFlow</div>
            <div className="text-xs text-slate-500 -mt-0.5">Habit Tracker</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4 relative">
          {!token ? (
            <>
              <Link
                href="/signup"
                className="text-sm text-slate-700 hover:underline"
              >
                Signup
              </Link>
              <Link href="/" className="btn btn-ghost">
                Login
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
              >
                <UserCircleIcon className="w-8 h-8 text-slate-600 hover:text-slate-800 transition" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-lg p-4 z-50 animate-fade-in">
                  {user && (
                    <div className="mb-3 text-center">
                      <div className="text-sm font-semibold">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  )}

                  <div className="border-t my-2"></div>

                  {/* Streak Info */}
                  <div className="grid grid-cols-1 gap-2 text-sm text-slate-700">
                    <div>
                      Total streak:
                      <span className="font-medium">{totalStreak}</span>
                    </div>
                    <div>
                      Longest streak:
                      <span className="font-medium">{longestStreak}</span>
                    </div>
                    <div>
                      Habits completed today:
                      <span className="font-medium">{habitsToday}</span>
                    </div>
                  </div>

                  <div className="border-t my-2"></div>

                  <button
                    onClick={logout}
                    className="w-full text-left text-red-600 hover:text-red-800 font-medium text-sm transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
