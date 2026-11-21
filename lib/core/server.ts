'use server'

import { headers } from "next/headers"
import { auth } from "../auth"

export const getSession = async() => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session
}

export const getToken = async () => {
  const jwtToken = await auth.api.getToken({
    headers: await headers(),
  });
  const token = jwtToken?.token;
  return token;
};
