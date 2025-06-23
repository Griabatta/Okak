"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import './signup/signup.css'
import '../global.css'
import Header from "@/components/Header";

export default function SignupPage({auth}: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("STUDENT");
    const [groupId, setGroupId] = useState(0);
    const [institutionId, setInstitutionId] = useState(0);
    const [token, setToken] = useState("");
    const [tokenCheckBox, setTokenCheckBox] = useState<any>();
    const router = useRouter();
    const [inst, setInst] = useState([]);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetchGroup();
    }, [institutionId])

    useEffect(() => {fetchInst()});

    

    const fetchInst = async () => {
        const resInstitution = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/institutions`,
            {
                method: "GET"
            }
        );
        const dataInst = await resInstitution.json();
        const formatingInst = dataInst.map((inst: any) => {
            const data = {
                id: inst.id,
                name: inst.name,
            }
            return data;
        })
        setInst(formatingInst)
        
    }

    const fetchGroup = async () => {
        const resGroup = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/byInstitutionId`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({institutionId: institutionId})
        });

        const dataGroup = await resGroup.json();
        const dataResGroup = dataGroup.map((group: any) => {
            const data = {
                id: group.id,
                name: group.name,
                class: group.class,

            }
            return data;
        })
        setGroups(dataResGroup)
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenCheckBox) { //
        console.log(lastName + " " + firstName)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/teacher`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ referralToken: token, email, password, lastName: lastName, firstName: firstName, role: "TEACHER", institutionId }),
            credentials: "include", 
        });
        if (res.ok) {
            return auth=true; 
        }
        
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, lastName: lastName, firstName: firstName, role: "STUDENT", institutionId }),
      credentials: "include", 
    });

    if (res.ok) {
      router.push("/"); 
    }
  };

  return (
    <>
        <Header/ >
        <form onSubmit={handleSubmit} className="signup">
            <div className="signup__container">
                <h1>Регистрация</h1>
                <label htmlFor="">Почта:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="">Пароль:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label htmlFor="">Имя:</label>
                <input
                    type="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <label htmlFor="">Фамилия:</label>
                <input
                    type="lasName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <label htmlFor="">Институт:</label>
                <select
                    name="institutionId"
                    value={institutionId}
                    onChange={(e) => setInstitutionId(Number(e.target.value))}
                    required
                >
                    <option value="">Выберите учреждение..</option>
                    
                    {inst.map((inst: any) => (
                        <option key={inst.id} value={inst.id}>
                        {inst.name}
                        </option>
                    ))}
                </select>
                {
                    !tokenCheckBox?
                    <>
                        <label htmlFor="">Группа:</label>
                        <select
                            name="groupId"
                            value={groupId}
                            onChange={(e) => setGroupId(Number(e.target.value))}
                            required
                        >
                            <option value="">Выберите группу..</option>
                            
                            {groups.map((group: any) => (
                                <option key={group.id} value={group.id}>
                                {group.name + " (курс - " + group.class + ")"}
                                </option>
                            ))}
                        </select>
                    </>
                    :
                    <>
                        <label htmlFor="">Группа:</label>
                        <select
                            name="groupId"
                            value={groupId}
                            onChange={(e) => setGroupId(Number(e.target.value))}
                            disabled
                        >
                            <option value="">Выберите группу..</option>
                            
                            {groups.map((group: any) => (
                                <option key={group.id} value={group.id}>
                                {group.name + " курс - " + group.class}
                                </option>
                            ))}
                        </select>
                    </>
                }
                <div className="sugnup__token">
                    <div className="token__check">
                        <label htmlFor="checkboxToken">Преподаватель?</label>
                        <input 
                            name="checkboxToken"
                            type="checkbox"
                            onChange={(e) => {setTokenCheckBox(e.target.checked)}}
                        />
                    </div>
                    {
                        tokenCheckBox? 

                        (
                            <>
                                <label htmlFor="">Реферальный токен:</label>
                                <input
                                    type="token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                />
                            </>
                        )
                        :
                        undefined
                    }
                </div>
                <div className="sugnup__action">
                    <button type="submit" className="signup__button">Зарегистрироваться</button>
                    <p>Есть аккаунт? <Link href="/login" className="signup__link">Авторизация.</Link></p>
                </div>
                
            </div>
        </form>
    </>
    
  );
}