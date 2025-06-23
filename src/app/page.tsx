'use client'
import Header from "@/components/Header";
import { useAuth } from "@/providers/AuthProvider";
import Schedule from "./schedule/page";
import '../app/global.css'


export default function Home() {
  const user = useAuth();
  
  return (
    <div>
      <Header/>
      { !user?.user?.id? 
        <div className="schedule">
          <h1>Расписание:</h1>
            <p>Пока что тут ничего нет. Авторизируйтесь.</p>
        </div>
        :
        <div className="schedule">
          <h1>Расписание:</h1>
          <Schedule />
        </div>
      }
     
    </div>
  );
}
