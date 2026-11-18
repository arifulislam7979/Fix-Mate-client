import { IServices,} from "@/app/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";


export const getService = async(data: IServices) => {
    const res = await fetch(`${BASE_URL}/services`,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    return res.json()
}

export const updateServices = async(id:string, data:unknown) => {
    const res = await fetch(`${BASE_URL}/services/${id}`,{
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(data)
    })
    return res.json()
}

export const deleteServices = async(id: string) => {
    const res = await fetch(`${BASE_URL}/services/${id}`,{
        method: 'DELETE'
    })
    return res.json()
}