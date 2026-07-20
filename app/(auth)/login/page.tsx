"use client";

import { InputAuth } from "@/components/auth/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Something went wrong.");
        return;
      }

      router.push("/feed");
    } catch (error) {
      console.error(error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center bg-black">
      <div className="w-full max-w-xl h-screen">
        <div className="mt-24 flex flex-col items-center">
          <div className="text-center font-sans text-sm tracking-wider text-[#B8B8B8]">
            your name stays with you. nothing else does.
          </div>

          <div className="mt-6 flex w-full flex-col items-center">
            <InputAuth
              type="email"
              placeholder="enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputAuth
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="mt-3 w-full max-w-xs text-center text-sm text-red-500">
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={
                loading ||
                !email.trim() ||
                !password
              }
              className="mt-8 w-full max-w-xs cursor-pointer rounded-xs bg-white py-2 font-sans text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <div className="mt-7 w-full max-w-xs text-center font-sans text-xs tracking-wider text-[#B8B8B8]">
              No email is ever shown on your posts or profile. It's used only
              to recover your account.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}