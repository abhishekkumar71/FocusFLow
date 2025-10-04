import { useState } from "react";
import Navbar from "../components/Navbar";
import { useForm } from "react-hook-form";
import api from "../utils/api";
import { setToken, getToken } from "../utils/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";

type LoginForm = { email: string; password: string };

export default function Home() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = getToken();
    if (t) router.push("/dashboard");
  }, []);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post("/api/user/login", data);
      setToken(res.data.token);
      toast.success("Logged in");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading && <Loader />}
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Login
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              {...register("email")}
              placeholder="Email"
              className="p-3 border rounded-xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="p-3 border rounded-xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex justify-center items-center gap-2"
              disabled={loading}
            >
              Login
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Signup
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
