"use server";

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

export const deleteUser = async(userId:string) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
  });
  return res.json()
};
