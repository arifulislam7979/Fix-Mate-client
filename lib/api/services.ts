
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const Services = async(query = "") => {
    const res = await fetch(`${BASE_URL}/services?${query}`, {
    cache: "no-store", 
  })
    return res.json()
}