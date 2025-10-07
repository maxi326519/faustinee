export interface User {
  id?: string;
  name: string;
  role: UserRol;
  status: UserStatus;
  email: string;
  password?: string;
}

export enum UserRol {
  ANY = "",
  Admin = "Admin",
  Asistente = "Asistente",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ANY = "",
}

export const initUser = (): User => ({
  name: "",
  role: UserRol.Admin,
  status: UserStatus.ACTIVE,
  email: "",
});
