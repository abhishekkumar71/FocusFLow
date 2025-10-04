import { useState } from "react";
import Navbar from "../components/Navbar";
import { useForm } from "react-hook-form";
import api from "../utils/api";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { setToken } from "../utils/auth";
import Loader from "../components/Loader";

type SignupForm = { name: string; email: string; password: string };

export default function Signup() {
  const { register, handleSubmit } = useForm<SignupForm>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    try {
      const res = await api.post("/api/user/register", data);
      setToken(res.data.token);
      toast.success("Registered successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}

      <Navbar />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-pink-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Signup
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              {...register("name")}
              placeholder="Full Name"
              className="p-3 border rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
            <input
              {...register("email")}
              placeholder="Email"
              className="p-3 border rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="p-3 border rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold py-3 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
              disabled={loading}
            >
              Signup
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <a href="/" className="text-indigo-600 font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
