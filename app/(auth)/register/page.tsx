"use client";

import { InputComponent } from "@/components/auth/InputComponent";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleRegister() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Something went wrong");
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error(error);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="my-16 flex w-full flex-col items-center px-4 sm:my-24">
    <h1 className="font-sans text-[24px]">
      Register
    </h1>

    <div className="mt-6 flex w-full max-w-md flex-col gap-3">
      <InputComponent
        type="text"
        placeholder="username"
        value={username}
        onChage={(e) => setUsername(e.target.value)}
        size="sm"
      />

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

      <button
        onClick={handleRegister}
        disabled={
          loading ||
          !username.trim() ||
          !email.trim() ||
          !password
        }
        className="
          mt-5
          w-full
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
        {loading ? "Creating..." : "Create Account"}
      </button>
    </div>
  </div>
);
}