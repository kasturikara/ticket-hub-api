import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        res.status(401).json({
          success: false,
          message: error?.message || "Authentication failed",
        });
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profileData) {
        res.status(500).json({
          success: false,
          message: profileError?.message || "Failed to retrieve user profile",
        });
        return;
      }

      const jwtToken = jwt.sign(
        {
          id: data.user.id,
          email: data.user.email,
          role: profileData.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        token: jwtToken,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: profileData.role,
          name: profileData.name,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      await supabase.auth.signOut();
      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }
}
