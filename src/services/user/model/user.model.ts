import { supabase } from "../../../config/supabase";
import { IProfile, IUser } from "../user.interface";

export class UserModel {
  private static readonly PROFILES_TABLE = "profiles";

  // create a new user profile
  static async createProfile(profile: IProfile): Promise<IProfile> {
    const { data, error } = await supabase
      .from(this.PROFILES_TABLE)
      .insert(profile)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    return data;
  }

  // get user profile by id
  static async getProfileById(id: string): Promise<IProfile | null> {
    const { data, error } = await supabase
      .from(this.PROFILES_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Profile not found
      }
      throw new Error(`Failed to get profile: ${error.message}`);
    }

    return data;
  }

  // update user profile
  static async updateProfile(
    id: string,
    profile: Partial<IProfile>
  ): Promise<IProfile> {
    const { data, error } = await supabase
      .from(this.PROFILES_TABLE)
      .update(profile)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  }

  // delete user profile
  static async deleteProfile(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.PROFILES_TABLE)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
  }

  // get all profiles with optional filtering and pagination
  static async getProfiles(
    options: {
      page?: number;
      limit?: number;
      role?: string;
      search?: string;
    } = {}
  ): Promise<{ data: IProfile[]; total: number }> {
    const { page = 1, limit = 10, role, search } = options;

    const offset = (page - 1) * limit;

    let query = supabase
      .from(this.PROFILES_TABLE)
      .select("*", { count: "exact" });

    if (role) query = query.eq("role", role);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to get profiles: ${error.message}`);
    }

    return { data: data || [], total: count || 0 };
  }

  // get user by id from auth.users
  static async getUserById(id: string): Promise<IUser | null> {
    const { data, error } = await supabase.auth.admin.getUserById(id);

    if (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }

    return data.user
      ? {
          id: data.user.id,
          email: data.user.email,
        }
      : null;
  }
}
