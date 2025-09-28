import { Request, Response } from "express";
import { UserModel } from "./model/user.model";

export class UserController {
  // get the profile of the currently authenticated user
  static async getMyProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: "Not Authenticated" });
        return;
      }

      const profile = await UserModel.getProfileById(userId);

      if (!profile) {
        res.status(404).json({ success: false, message: "Profile not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: profile,
      });
    } catch (error) {
      console.error("Error in getMyProfile:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }

  // update the profile of the currently authenticated user
  static async updateMyProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: "Not Authenticated" });
        return;
      }

      const { name } = req.body;

      if (!name || typeof name !== "string" || name.trim() === "") {
        res.status(400).json({
          success: false,
          message: "Valid name is required",
        });
        return;
      }

      const updatedProfile = await UserModel.updateProfile(userId, { name });

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (error) {
      console.error("Error in updateing Profile:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }

  // get a user profile by id
  static async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (req.user?.role !== "admin") {
        res.status(403).json({
          success: false,
          message: "Permission denied",
        });
        return;
      }

      const profile = await UserModel.getProfileById(id);

      if (!profile) {
        res.status(404).json({
          success: false,
          message: "Profile not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: profile,
      });
    } catch (error) {
      console.error("Error getting user profile:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // get all user profiles (admin only)
  static async getAllProfiles(req: Request, res: Response): Promise<void> {
    try {
      if (req.user?.role !== "admin") {
        res.status(403).json({
          success: false,
          message: "Permission denied",
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as string | undefined;
      const search = req.query.search as string | undefined;

      const { data, total } = await UserModel.getProfiles({
        page,
        limit,
        role,
        search,
      });

      res.status(200).json({
        success: true,
        message: "Profiles retrieved successfully",
        data,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error getting profiles:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // update user profile (admin only)
  static async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (req.user?.role !== "admin") {
        res.status(403).json({
          success: false,
          message: "Permission denied",
        });
        return;
      }

      const { name, role } = req.body;

      if (!name || typeof name !== "string" || name.trim() === "") {
        res.status(400).json({
          success: false,
          message: "Valid name is required",
        });
        return;
      }

      if (role && !["admin", "user"].includes(role)) {
        res.status(400).json({
          success: false,
          message: "Role must be either 'admin' or 'user'",
        });
        return;
      }

      const updatedProfile = await UserModel.updateProfile(id, { name, role });

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}
