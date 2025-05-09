export type UserRole = "USER" | "ADMIN";

export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}
