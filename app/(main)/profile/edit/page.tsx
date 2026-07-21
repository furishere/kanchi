"use client";

import { InputComponent } from "@/components/auth/InputComponent";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await fetch("/api/profile", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message);
          return;
        }

        setUsername(data.profile.username ?? "");
        setBio(data.profile.bio ?? "");
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoadingProfile(false);
      }
    }

    getProfile();
  }, []);

  async function handleUpdate() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          bio: bio.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  if (loadingProfile) {
    return (
      <div className="mt-24 text-center font-ibm uppercase">
        Loading...
      </div>
    );
  }

  return (
    <div className="mt-24 flex flex-col items-center">
  <label className="w-full max-w-md">
    <div className="m-2 font-ibm text-[13px] uppercase text-gray-400">
      New username
    </div>

    <InputComponent
      placeholder="change username"
      type="text"
      value={username}
      onChage={(e) => setUsername(e.target.value)}
      size="sm"
    />
  </label>

  <label className="mt-4 w-full max-w-md">
    <div className="m-2 font-ibm text-[13px] uppercase text-gray-400">
      Add bio
    </div>

    <InputComponent
      placeholder="tell people about yourself"
      type="text"
      value={bio}
      onChage={(e) => setBio(e.target.value)}
      size="sm"
    />
  </label>

  <button
    className="
      mt-8
      w-full
      max-w-md
      cursor-pointer
      bg-button
      py-2
      font-ibm
      text-[11px]
      uppercase
      text-button-text
      disabled:opacity-50
    "
  >
    Update Profile
  </button>
</div>
  );
}