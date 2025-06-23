'use client';
import Header from "@/components/Header";
import { AuthContextType, useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";

export default function SettingPage() {
    // time
    const [timeBegin, setTimeBegin] = useState("");
    const [timeEnd, setTimeEnd] = useState("");
    // subject
    const [subjectName, setSubjectName] = useState("");
    const [subjectClass, setSubjectClass] = useState(0);
    // cabs
    const [cabName, setCabName] = useState("");
    // teacher
    const [teacherName, setTeacherName] = useState("");
    const [teacherSurname, setTeacherSurname] = useState("");
    const [teacherPatronymic, setTeacherPatronymic] = useState("");
    // status
    const [sendStatus, setSendStatus] = useState({type: "", code: 0});
    const [errorStatus, setErrorStatus] = useState({type: "", code: 0});

    const user: AuthContextType | null = useAuth();
    const [instId, setInstId] = useState(0);
    useEffect(() => {
        const instId = user?.user?.institutionId;
        setInstId(instId || 0)
    }, [user])
    

    const send = async (e: React.FormEvent, type: string,) => {
        e.preventDefault();
        if (instId === 0) {
            setErrorStatus({type: 'globalSettingError', code: 500});
        }
        switch (type) {
            case "Time": {
                if (timeBegin === "" || timeEnd === "") {
                    setErrorStatus({type: 'Time', code: 403});
                    setSendStatus({type: "", code: 0})
                    break;
                }
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/time`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ timeBegin: String(timeBegin), timeEnd: String(timeEnd), institutionId: instId }),
                    credentials: "include", // Важно для кук!
                });
                if (res.status === 200) {
                    setSendStatus({type: 'Time', code: 200})
                    setErrorStatus({type: "", code: 0})
                } else {
                    setErrorStatus({type: 'Time', code: res.status})
                    setSendStatus({type: "", code: 0})
                }
                break;
            }
            case "Subject": {
                if (!subjectName || !subjectClass) {
                    setErrorStatus({type: 'Subject', code: 403});
                    setSendStatus({type: "", code: 0})
                    break;
                }
                console.log(JSON.stringify({ name: subjectName, class: subjectClass, institutionId: instId }))
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subject`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: subjectName, class: subjectClass, institutionId: instId }),
                    credentials: "include", // Важно для кук!
                });
                if (res.status === 200) {
                    setSendStatus({type: 'Subject', code: 200})
                    setErrorStatus({type: "", code: 0})
                } else {
                    setErrorStatus({type: 'Subject', code: res.status})
                    setSendStatus({type: "", code: 0})
                }
                break;
            }
            case "Cabs": {
                if (cabName === "") {
                    setErrorStatus({type: 'Cabs', code: 403});
                    setSendStatus({type: "", code: 0})
                    break;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cabs`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: cabName, institutionId: instId }),
                    credentials: "include", // Важно для кук!
                });
                if (res.status === 200) {
                    setSendStatus({type: 'Cabs', code: 200})
                    setErrorStatus({type: "", code: 0})
                } else {
                    setErrorStatus({type: 'Cabs', code: res.status})
                    setSendStatus({type: "", code: 0})
                }
                break;
            }
            case "Teacher": {
                if (teacherName === "" || teacherSurname === "" || teacherPatronymic === "") {
                    setErrorStatus({type: 'Teacher', code: 403});
                    setSendStatus({type: "", code: 0})
                    break
                }
                const body = {
                    institutionId: instId,
                    surname: teacherSurname,
                    patronymic: teacherPatronymic,
                    name: teacherName
                }
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                    credentials: "include", // Важно для кук!
                });
                if (res.status === 200) {
                    setSendStatus({type: 'Teacher', code: 200})
                    setErrorStatus({type: "", code: 0})
                } else {
                    setErrorStatus({type: 'Teacher', code: res.status})
                    setSendStatus({type: "", code: 0})
                }
                break;
            }
        }
    }

    

    // const sendTime = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!timeBegin || !timeEnd) {
    //         setErrorCabStatus(true);
    //     }

    //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/time`, {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ timeBegin, timeEnd }),
    //         credentials: "include", // Важно для кук!
    //     });

    //     if (res.ok) {
    //       setSendTimeStatus(true);
    //     } else {
    //         setErrorTimeStatus(true);
    //     }
    // };

    return(
        <div>
            <Header/>
            <h1>Временные рамки:</h1>
            <form action="">
                {errorStatus.type === "Time" && errorStatus.code !== 200? <p>Не удалось добавить время. Попробуйте позже.</p> : undefined}
                {sendStatus.type === "Time" && sendStatus.code === 200? <p>Время {timeBegin+"-"+timeEnd} было успешно добавлено</p> : undefined}
                
                <label htmlFor="timeBegin">Время начала урока:</label>
                <input id="timeBegin" type="time" value={timeBegin} onChange={(e) => setTimeBegin(e.target.value)} />
                <label htmlFor="timeEnd">Время конца урока:</label>
                <input id="timeEnd" type="time" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} />
                {errorStatus.type === "Time" && errorStatus.code === 403? <p>Вы не выбрали временные рамки.</p> : undefined}
                <button onClick={(e) => {send(e, "Time")}}>Сохранить</button>
            </form>
            <h1>Кабинеты:</h1>
            <form action="">
                {errorStatus.type === "Cabs" && errorStatus.code !== 200? <p>Не удалось добавить кабинет. Попробуйте позже.</p> : undefined}
                {sendStatus.type === "Cabs" && sendStatus.code === 200? <p>Кабинет {cabName} был успешно добавлен</p> : undefined}
                <label htmlFor="cabName">Адрес кабинета:</label>
                <input id="cabName" type="text" value={cabName} onChange={(e) => setCabName(e.target.value)} placeholder="Кабинет.." />
                {errorStatus.type === "Cabs" && errorStatus.code === 403? <p>Вы не ввели адрес.</p> : undefined}
                <button onClick={(e) => {send(e, "Cabs")}}>Сохранить</button>
            </form>
            <h1>Предметы:</h1>
            <form action="">
                {errorStatus.type === "Subject" && errorStatus.code !== 200? <p>Не удалось добавить предмет. Попробуйте позже.</p> : undefined}
                {sendStatus.type === "Subject" && sendStatus.code === 200? <p>Предмет {subjectName} для курса №{subjectClass} был успешно добавлен</p> : undefined}
                <label htmlFor="subjectName">Название предмета:</label>
                <input type="text" id="subjectName" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
                <label htmlFor="subjectClass">Курс:</label>
                <input type="number" id="subjectClass" value={subjectClass} onChange={(e) => setSubjectClass(Number(e.target.value))} />
                {errorStatus.type === "Time" && errorStatus.code === 403? <p>Вы не ввели название предмета или не выбрали курс.</p> : undefined}
                <button onClick={(e) => {send(e, "Subject")}}>Сохранить</button>
            </form>
            <h1>Преподаватели:</h1>
            <form action="" className="form__teacher">
                {errorStatus.type === "Teacher" && errorStatus.code !== 200? <p>Не удалось добавить преподавателя. Попробуйте позже.</p> : undefined}
                {sendStatus.type === "Teacher" && sendStatus.code === 200? 
                <p >
                    Преподаватель {" "}
                        {teacherSurname + " "}
                        {" "+teacherName.slice(0,1).toUpperCase() + ". "}
                        {" "+teacherPatronymic.slice(0,1).toUpperCase() + "."}
                    {" "}успешно добавлен
                </p> : undefined}
                <label htmlFor="teacherSurename">Фамилия:<span style={{color: "red"}}>*</span></label>
                <input type="text" id="teacherSurename" value={teacherSurname} onChange={(e) => setTeacherSurname(e.target.value)} />
                <label htmlFor="teacherName">Имя:<span style={{color: "red"}}>*</span></label>
                <input type="text" id="teacherName" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
                <label htmlFor="teacherPatronymic">Отчество:<span style={{color: "red"}}>*</span></label>
                <input type="text" id="teacherPatronymic" value={teacherPatronymic} onChange={(e) => setTeacherPatronymic(e.target.value)} />
                {errorStatus.type === "Time" && errorStatus.code === 403? <p>Вы заполнили не всю форму.</p> : undefined}
                <button onClick={(e) => {send(e, "Teacher")}}>Сохранить</button>
            </form>
        </div>
        
    )
}