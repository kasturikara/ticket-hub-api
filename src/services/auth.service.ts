import { supabase } from "../config/supabase";
import {
  ILoginRequest,
  IRegisterRequest,
  IUser,
} from "../interfaces/auth.interfaces";
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../utils/errors";

export class AuthService {
  // Register a new user
  static async register(userData: IRegisterRequest): Promise<any> {
    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
        },
      },
    });

    if (authError) {
      throw new BadRequestError(authError.message || "Registration failed");
    }

    return {
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        name: authData.user?.user_metadata?.name,
      },
      session: authData.session,
    };
  }

  // Login user
  static async login(loginData: ILoginRequest): Promise<any> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    if (error) {
      throw new UnauthorizedError(error.message || "Invalid email or password");
    }

    return {
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name,
      },
      session: data.session,
    };
  }

  // Get current user profile
  static async getCurrentUser(token: string): Promise<IUser> {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      throw new UnauthorizedError(error.message || "Invalid token");
    }

    return {
      id: data.user?.id,
      email: data.user?.email || "",
      name: data.user?.user_metadata?.name,
    };
  }

  // Logout user
  static async logout(token: string): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new InternalServerError(error.message || "Logout failed");
    }
  }
}
