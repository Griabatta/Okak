"use client"
import ScheduleModal from "@/components/ModalSchedule";
import { useAuth } from "@/providers/AuthProvider";
import { authFetch } from "@/utils/api";
import { useEffect, useState } from "react"
import './style/schedule.css'

const DAYS_OF_WEEK: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export default function Schedule() {
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<number | null>(null);
  const [currentDay, setCurrentDay] = useState<DayOfWeek | null>(null);
  const [currentOrder, setCurrentOrder] = useState<number | null>(null);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [groups, setGroups] = useState([]);
  

  const dayNames = {
    MONDAY: "Понедельник",
    TUESDAY: "Вторник",
    WEDNESDAY: "Среда",
    THURSDAY: "Четверг",
    FRIDAY: "Пятница",
    SATURDAY: "Суббота",
    SUNDAY: "Воскресенье",
  };
  
  const user = useAuth();

  useEffect(() => {
    fetchScheduleData();
  }, [modalOpen, user]);

  const fetchScheduleData = async () => {
    console.log(`user ${user?.user?.id}`)
    if (!user?.user?.id) {
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedule?institutionId=${user?.user?.institutionId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const groups = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/byInstitutionId`, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({institutionId: user?.user?.institutionId})
      });
      
      const groupData = await groups.json();
      console.log(groupData)
      setGroups(groupData);
      
      const data = await res.json();
      setScheduleData(data.data);
      detectConflicts(data.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const detectConflicts = (data: any[]) => {
    const allLessons: any[] = [];
    const conflictsList: any[] = [];

    // Собираем все уроки
    data.forEach(group => {
      Object.entries(group.days).forEach(([day, items]: [string, any]) => {
        items.forEach((lesson: any) => {
          allLessons.push({
            ...lesson,
            groupId: group.groupId,
            groupName: group.groupName,
            dayOfWeek: day
          });
        });
      });
    });

    // Проверяем конфликты
    allLessons.forEach(lesson => {
      const sameSlotLessons = allLessons.filter(l => 
        l.orderNumber === lesson.orderNumber && 
        l.dayOfWeek === lesson.dayOfWeek &&
        (l.teacher.id === lesson.teacher.id || 
         l.classroom.id === lesson.classroom.id)
      );

      if (sameSlotLessons.length > 1) {
        conflictsList.push({
          lesson,
          conflictsWith: sameSlotLessons.filter(l => l.id !== lesson.id)
        });
      }
    });

    setConflicts(conflictsList);
  };

  const getLessonColor = (lesson: any) => {
    if (!lesson) return '';
    
    // Желтый для комбинированных пар
    if (lesson.isCombined) return 'bg-yellow-100';
    
    // Красный для конфликтов
    const hasConflict = conflicts.some(c => 
      c.lesson.id === lesson.id || 
      c.conflictsWith.some((l: any) => l.id === lesson.id)
    );
    
    return hasConflict ? 'bg-red-100' : '';
  };

  const getLessonTooltip = (lesson: any) => {
    if (!lesson) return '';
    
    if (lesson.isCombined) {
      return `Комбинированная пара с группой ${lesson.combinedWithGroup || ''}`;
    }
    
    const conflict = conflicts.find(c => c.lesson.id === lesson.id);
    if (conflict) {
      return `Конфликт с: ${conflict.conflictsWith
        .map((l: any) => `${l.groupName} (${l.teacher.surname} ${l.teacher.name[0]}. в ${l.classroom.name})`)
        .join(', ')}`;
    }
    
    return '';
  };

  const handleCreateLesson = (groupId: number, day: DayOfWeek, orderNumber: number) => {
    setCurrentGroup(groupId);
    setCurrentDay(day);
    setCurrentOrder(orderNumber);
    setModalOpen(true);
  };

  const handleSaveLesson = async (data: any) => {
    try {
        const body = {
          classroomId       : Number(data.classroomId),
          groupsId          : Number(data.groupsId),
          institutionId     : Number(data.institutionId),
          isCombined        : data.isCombined,
          orderNumber       : Number(data.orderNumber),
          parity            : data.parity,
          subjectId         : Number(data.subjectId),
          teacherId         : Number(data.teacherId),
          timeId            : Number(data.timeId),
          dayOfWeek         : data.dayOfWeek
        }
        const response = await authFetch(
            data.id 
                ? `${process.env.NEXT_PUBLIC_API_URL}/schedule/${data.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/schedule`,
            {
                method: data.id ? 'PUT' : 'POST',
                body: JSON.stringify(body)
            }
        );
        console.log(response)
        if (response.ok) {
            fetchScheduleData();
            setModalOpen(false);
        }
        } catch (error) {
            console.error('Error saving lesson:', error);
            alert("Данный день недели был уже заполнен")
            // Показать пользователю сообщение об ошибке
        }
    };


  const getLessonsForDay = (groupId: number, day: DayOfWeek) => {
    const group = scheduleData.find(g => g.groupId === groupId);
    // console.log(group.days[day])
    if (!group) return [];
    
    return group.days[day] || [];
  };

  const handleAddNewLesson = (groupId: number, day: DayOfWeek) => {
    setCurrentGroup(groupId);
    setCurrentDay(day);
    const lessons = getLessonsForDay(groupId, day);
    // console.log(lessons)
    const newOrderNumber = lessons.length > 0 
      ? Math.max(...lessons.map((l: any) => l.orderNumber)) + 1
      : 1;
    
    
    setCurrentOrder(newOrderNumber);
    setModalOpen(true);
  };

  return (
    <div className="schedule">
      <div className="schedule__container">
        {scheduleData.map((group: any) => (
          <div key={group.groupId} className="schedule_group">
            <h2>{group.groupName}</h2>
            
            <div className="schedule__byGroup">
              {DAYS_OF_WEEK.map((day: DayOfWeek) => {
                const lessons = getLessonsForDay(group.groupId, day);
                const hasLessons = lessons.length > 0;
                
                return (
                  <div key={day} className="schedule__days">
                    <h3>{dayNames[day]}</h3>
                    
                    {/* Отображаем существующие уроки */}
                    {lessons.map((lesson: any, index: number) => (
                      <div 
                        key={`${day}-${lesson.orderNumber}`}
                        className={`lesson ${getLessonColor(lesson)}`}
                        title={getLessonTooltip(lesson)}
                      >
                        <div className="schedule__column-items">
                          <div className="schedule__item">
                            <div className="schedule__lesson-index">
                              {lesson.orderNumber}
                            </div>
                            <div className="schedule__info">
                              <div className="schedule__subject">
                                {lesson.subject.name}
                              </div>
                              <div className="schedule__tc">
                                <span>
                                  {lesson.teacher.surname} {lesson.teacher.name[0]}.{lesson.teacher.patronymic[0]}.
                                </span>
                                <span>{lesson.classroom.name}</span>
                              </div>
                            </div>
                            <div className="schedule__time">
                              {lesson.time.timeBegin} - {lesson.time.timeEnd}
                            </div>
                            {lesson.isCombined && <span>Комбинированная</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Кнопка добавления нового урока */}
                    {(user?.user?.role === "TEACHER" || user?.user?.role === "ADMIN") && (
                      
                      <div className="schedule__add-schedule">
                        <button
                          className="schedule__add-button"
                          onClick={() => handleAddNewLesson(group.groupId, day)}
                        >
                          + Добавить урок
                        </button>
                      </div>
                    )}
                    
                    
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <ScheduleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveLesson}
        groupId={currentGroup || 0}
        orderNumber={currentOrder || 1}
        dayOfWeek={currentDay || 'MONDAY'}
      />
    </div>
    )
}