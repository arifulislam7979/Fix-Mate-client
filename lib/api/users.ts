"use server";

import { UpdateProfilePayload, Users } from "@/app/types";
import { notFound } from "next/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, {
    cache: "no-store",
  });
  if (!res.ok) {
    notFound();
  }
  return res.json();
};

export const updateUserRole = async (id: string, newRole: string) => {
  const res = await fetch(`${BASE_URL}/users/${id}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role: newRole }),
  });
  return res.json();
};

export const deleteUser = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
  });
  return res.json();
};

export const updateUserProfile = async (
  userId: string,
  payload: UpdateProfilePayload,
) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    return {
      success: false,
      message: errData?.message || "Failed to update profile.",
    };
  }

  return res.json();
};

export const getUserByEmail = async (email: string) => {
  const url = new URL(`${BASE_URL}/users`);
  url.searchParams.set("email", email);

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  if (Array.isArray(data)) {
    return data[0] || null;
  }

  return data?.user || data || null;
};
