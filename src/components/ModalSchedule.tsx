"use client"
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { authFetch } from "@/utils/api";
import './styles/modalSchedule.css'

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  groupId: number;
  initialData?: any;
  orderNumber?: number;
  dayOfWeek?: string;
  parity?: string;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  groupId,
  initialData,
  orderNumber,
  dayOfWeek
}: ScheduleModalProps) {
  const user = useAuth();
  const [formData, setFormData] = useState({
    institutionId: user?.user?.institutionId || 0,
    subjectId: initialData?.subject?.id || 0,
    teacherId: initialData?.teacher?.id || 0,
    classroomId: initialData?.classroom?.id || 0,
    timeId: initialData?.time?.id || 0,
    orderNumber: initialData?.orderNumber || orderNumber || 1,
    parity: [
      'ODD', 'EVEN', 'BOTH'
    ],
    isCombined: initialData?.isCombined || false,
    groupsId: groupId,
    dayOfWeek: dayOfWeek
  });
  
  const [options, setOptions] = useState({
    cabs: [],
    subjects: [],
    teachers: [],
    times: [],
    parity: ['']
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  const fetchOptions = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem('accessToken'); // Или из вашего провайдера auth
    
        const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
        };
        const [cabsRes, subjectsRes, teachersRes, timesRes]: any = await Promise.all([
            authFetch(`${process.env.NEXT_PUBLIC_API_URL}/cabs`),
            authFetch(`${process.env.NEXT_PUBLIC_API_URL}/subject`),
            authFetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher`),
            authFetch(`${process.env.NEXT_PUBLIC_API_URL}/time`)
        ]);

        // await subjectsRes.map((item: any) => {
        //     console.log(item)
        // })
        // Проверка статуса ответа
        if (!teachersRes.length) throw new Error('Ошибка загрузки учителей');
        if (!timesRes.length) throw new Error('Ошибка загрузки времени');

        setOptions({
            cabs: await cabsRes,
            subjects: await subjectsRes,
            teachers: await teachersRes,
            times: await timesRes,
            parity: formData.parity
        });
    } catch (error) {
        console.error('Error fetching options:', error);
        // Можно добавить уведомление для пользователя
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // console.log("name: " + name)
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? 'Редактировать запись' : 'Создать новую запись'}</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Скрытые поля */}
          <input type="hidden" name="institutionId" value={formData.institutionId} />
          <input type="hidden" name="groupsId" value={formData.groupsId} />
          <input type="hidden" name="dayOfWeek" value={dayOfWeek} />


          {/* Поля формы */}
            <div className="form-group">
            <label>Предмет:</label>
            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              required
              
            >
              <option value="">Выберите предмет</option>
              {options.subjects.map((subject: any) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.class})
                </option>
              ))}
            </select>
            </div>

            <div className="form-group">
              <label>Преподаватель:</label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                required
              >
                <option value="">Выберите преподавателя...</option>
                {options.teachers.map((teacher: any) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.surname + " " + 
                    teacher.name.slice(0,1) + ". " + 
                    teacher.patronymic.slice(0,1) + "."}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Кабинет:</label>
              <select
                name="classroomId"
                value={formData.classroomId}
                onChange={handleChange}
                required
              >
                <option value="">Выберите кабинет...</option>
                
                {options.cabs.map((cab: any) => (
                    <option key={cab.id} value={cab.id}>
                      {cab.name}
                    </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Время:</label>
              <select
                name="timeId"
                value={formData.timeId}
                onChange={handleChange}
                required
              >
                <option value="">Выберите время...</option>
                  {options.times.map((time: any) => (
                    <option key={time.id} value={time.id}>
                      {time.timeBegin + "-" + time.timeEnd}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Неделя:</label>
              <select
                name="parity"
                value={formData.parity}
                onChange={handleChange}
                required
              >
                <option value="">Выберите тип недели...</option>
                  {options.parity.map((parity: any, index: number) => (
                    <option key={index} value={parity}>
                      {
                        parity === 'BOTH'?
                        "Объединенная" :
                        parity === 'ODD'?
                        'Нечетная' :
                        'Четная'
                      }
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group">
              <label>Объединенная?:</label>
              <input
                name="isCombined"
                value={formData.isCombined}
                onChange={handleChange}
                type="checkbox"
                className="form-group__isCombined"
              />
              {/* isCombined */}
            </div>

          <div className="modal-actions">
            <button className="modal-actions--close" type="button" onClick={onClose}>Отмена</button>
            <button className="modal-actions--accept" type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}