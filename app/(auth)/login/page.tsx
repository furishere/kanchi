"use client";

import { InputComponent } from "@/components/auth/InputComponent";
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
        setError(data.message ?? "Something went wrong");
        return;
      }

      router.push("/feed");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-50 flex flex-col justify-center">
      <div className="flex justify-center font-sans text-[24px]">
        Login
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <InputComponent
          type="email"
          placeholder="email"
          value={email}
          onChage={(e) => setEmail(e.target.value)}
          size="sm"
        />

        <InputComponent
          type="password"
          placeholder="password"
          value={password}
          onChage={(e) => setPassword(e.target.value)}
          size="sm"
        />

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleLogin}
          disabled={
            loading ||
            !email.trim() ||
            !password
          }
          className="
            w-full
            max-w-md
            bg-button
            py-2
            font-ibm
            text-[11px]
            uppercase
            text-button-text
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? "Logging In..." : "Log In"}
        </button>
      </div>
    </div>
  );
}