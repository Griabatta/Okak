'use client';
import Header from "@/components/Header";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";

export default function SettingPage() {
    const [timeBegin, setTimeBegin] = useState("");
    const [timeEnd, setTimeEnd] = useState("");
    const [send, setSend] = useState(false);
    const [error, setError] = useState(false);

    const user = useAuth();

    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/time`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ timeBegin, timeEnd,  }),
            credentials: "include", // Важно для кук!
        });

        if (res.ok) {
          setSend(true);
        } else {
            setError(true)
        }
  };

    return(
        <div>
            <Header/>
            <h1>Временные рамки:</h1>
            <form action="">
                {error? <p>Не удалось добавить время. Попробуйте позже.</p> : undefined}
                {send? <p>Время было добавлено</p> : undefined}
                <label htmlFor="timeBegin">Время начала урока:</label>
                <input name="timeBegin" type="time" value={timeBegin} onChange={(e) => setTimeBegin(e.target.value)} />
                <label htmlFor="timeEnd">Время конца урока:</label>
                <input name="timeEnd" type="time" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} />
                <button onClick={() => {handleSubmit}}>Сохранить</button>
            </form>
        </div>
        
    )
}