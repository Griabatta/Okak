"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Изменённый импорт
import { useState } from "react";
import '../global.css';
import './style/login.css';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (res.ok) {
      router.push("/");
      location.reload();      
    }
  };

  return (
    <>
    <Header/>
      <div className="login">
        <form onSubmit={handleSubmit} className="login__form">
          <div className="login__input">
            <label htmlFor="emailUser">Почта:</label>
            <input
              name="emailUser"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login__input">
            <label htmlFor="passwordUser">Пароль:</label>
            <input
              name="passwordUser"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="login__action">
            <button type="submit" className="login__submit">Войти</button>
            <p>Нет аккаунта? <Link href="/signup">Регистрация.</Link></p>
          </div>
        </form>
      </div>
    </>
  );
}