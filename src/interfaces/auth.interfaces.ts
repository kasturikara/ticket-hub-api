export interface IUser {
  id?: string;
  email: string;
  name?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest extends ILoginRequest {
  name: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: any;
}
