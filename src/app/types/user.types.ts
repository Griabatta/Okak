export enum UserRole {
  STUDENT = 'STUDENT',
  GROUP_LEADER = 'GROUP_LEADER',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  institutionId: number;
  groupId?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterStudentData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  institutionId: number;
  groupId?: number;
}

export interface RegisterTeacherData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  referralToken: string;
}