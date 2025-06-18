"use client"
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react"

const mokSchedule = {
    // id          
    // subject     
    // teacher     
    // classroom   
    // startTime   
    // endTime     
    // dayOfWeek   
    // orderNumber 
    // parity      
    // isCombined  
    // groups      
}

export default function Schedule() {
    const {schedule, scheduleState}: any = useState();
    const user = useAuth();
    useEffect(() => {
        const res = fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedule`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ timeBegin: String(timeBegin), timeEnd: String(timeEnd), institutionId: instId }),
                credentials: "include", // Важно для кук!
            });
    }, [user])

    return (
        <div className="schedule">
            <div className="schedule__container">
                
            </div>
        </div>
    )
}