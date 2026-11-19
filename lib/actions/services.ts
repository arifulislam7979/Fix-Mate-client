'use server'
import { IServices,} from "@/app/types";
import { revalidatePath } from "next/cache";

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
    revalidatePath("/dashboard/technician/my-services");
    return res.json()
    
}

export const deleteServices = async(id: string) => {
    const res = await fetch(`${BASE_URL}/services/${id}`,{
        method: 'DELETE'
    })
    return res.json()
}

export const statusUpdate =async(id: string, data: unknown) => {
    const res = await fetch(`${BASE_URL}/services/${id}/status`,{
        method: "PATCH",
        headers: {
             "Content-Type": "application/json" 
        },
        body: JSON.stringify(data)
    })
    return res.json()
}