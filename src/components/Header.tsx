import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';

export default function Header() {
  const { user, isLoading }: any = useAuth(); // Получаем состояние загрузки

  // Пока данные загружаются
  if (isLoading) {
    return (
      <div className="header">
        <div>Загрузка...</div>
      </div>
    );
  }

  // После загрузки
  return (
    <div className="header">
      {!user ? (
        <Link href="/login">Авторизация</Link>
      ) : (
        <>
          <button>{user.email}</button>
          {(user.role === "TEACHER" || user.role === "ADMIN") && (
            <Link href="/setting">Настройки</Link>
          )}
        </>
      )}
    </div>
  );
}