import { Request, Response } from "express";
import { UserModel } from "./model/user.model";
import { AppError, catchAsync, logger } from "../../utils/error";

export class UserController {
  // get the profile of the currently authenticated user
  static getMyProfile = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("Not Authenticated", 401);
      }

      const profile = await UserModel.getProfileById(userId);

      if (!profile) {
        throw new AppError("Profile not found", 404);
      }

      logger.info(`User ${userId} retrieved their profile`);

      res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: profile,
      });
    }
  );

  // update the profile of the currently authenticated user
  static updateMyProfile = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("Not Authenticated", 401);
      }

      const { name } = req.body;

      if (!name || typeof name !== "string" || name.trim() === "") {
        throw new AppError("Valid name is required", 400);
      }

      const updatedProfile = await UserModel.updateProfile(userId, { name });

      logger.info(`User ${userId} updated their profile`);

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    }
  );

  // get a user profile by id
  static getUserProfile = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (req.user?.role !== "admin") {
        throw new AppError("Permission denied", 403);
      }

      const profile = await UserModel.getProfileById(id);

      if (!profile) {
        throw new AppError("Profile not found", 404);
      }

      logger.info(`Admin ${req.user?.id} retrieved profile of user ${id}`);

      res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: profile,
      });
    }
  );

  // get all user profiles (admin only)
  static getAllProfiles = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      if (req.user?.role !== "admin") {
        throw new AppError("Permission denied", 403);
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
    }
  );

  // update user profile (admin only)
  static updateUserProfile = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (req.user?.role !== "admin") {
        throw new AppError("Permission denied", 403);
      }

      const { name, role } = req.body;

      if (!name || typeof name !== "string" || name.trim() === "") {
        throw new AppError("Valid name is required", 400);
      }

      if (role && !["admin", "user"].includes(role)) {
        throw new AppError("Invalid role", 400);
      }

      const updatedProfile = await UserModel.updateProfile(id, { name, role });

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    }
  );
}
