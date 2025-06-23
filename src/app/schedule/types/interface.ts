export interface scheduleByAPI {
    institution: {
        name: string
    },
    subject: {
        name: string,
        class: number
    },
    time: {
        timeBegin: string,
        timeEnd: string
    },
    teacher: {
        name: string,
        surname: string,
        patronymic: string
    },
    classroom: {
        name: string
    },
    parity: string,
    dayOfWeek: string,
    orderNumber: number,
    groups: {
        id: number,
        name: string
    }
}

export interface scheduleForExport {
    institutionName: string
    subjectName: string
    subjectClass: number
    timeBegin: string
    timeEnd: string
    teacherName: string
    teacherSurname: string
    teacherPatronymic: string
    classRoom: string
    parity: string
    dayOfWeek: string
    orderNumber: number
    groupsId: number
    groupsName: string
}
