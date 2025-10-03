export interface IUser {
  id?: string;
  email?: string;
  password?: string;
}

export interface IProfile {
  id?: string;
  name: string;
  role: string;
  created_at?: Date;
}
