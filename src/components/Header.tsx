"use client"
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import './styles/header.css'
import { useRouter } from 'next/navigation';


export default function Header() {
  const { user, isLoading }: any = useAuth(); // Получаем состояние загрузки
  const router = useRouter();
  // Пока данные загружаются
  if (isLoading) {
    return (
      <div className="header">
        <div>Загрузка...</div>
      </div>
    );
  }
  console.log(user)
  // После загрузки
  return (
    <div className="header">
      <Link href={"/"} className='header__title'>ОКАК</Link>
      <div className='header__user'>
        {!user ? (
          <Link href="/login">Авторизация</Link>
        ) : (
          <>
            
            {(user.role === "TEACHER" || user.role === "ADMIN") && (
              // <button className='header__setting header--button'>
                <Link className='header--nav' href="/setting">Управление</Link>
              // {/* </button> */}
            )}
            {user?.id? 
              <button className='header--nav' 
                onClick={async () => {
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, { method: 'POST',credentials: 'include' });
                  if (res.ok) {
                    router.push('/login');
                    location.reload();
                    
                    
                  }
                }}
              >
                {user.email}
              </button>
              :
              <button className='header--nav' 
                onClick={async () => {
                  router.push('/login');
                }}
              >
                Войти
              </button>  
            }
          </>
        )}
      </div>
    </div>
  );
}