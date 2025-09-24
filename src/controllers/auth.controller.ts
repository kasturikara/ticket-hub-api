import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ILoginRequest, IRegisterRequest } from "../interfaces/auth.interfaces";
import { BadRequestError } from "../utils/errors";

export class AuthController {
  // Register a new user
  static async register(req: Request, res: Response): Promise<void> {
    const userData: IRegisterRequest = req.body;

    // Validate request data
    if (!userData.name || !userData.email || !userData.password) {
      throw new BadRequestError("Please provide name, email, and password");
    }

    const result = await AuthService.register(userData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: result.user,
        access_token: result.session?.access_token,
        refresh_token: result.session?.refresh_token,
      },
    });
  }

  // Login user
  static async login(req: Request, res: Response): Promise<void> {
    const loginData: ILoginRequest = req.body;

    // Validate request data
    if (!loginData.email || !loginData.password) {
      throw new BadRequestError("Please provide email and password");
    }

    const result = await AuthService.login(loginData);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        access_token: result.session?.access_token,
        refresh_token: result.session?.refresh_token,
      },
    });
  }

  // Get current user profile
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: req.user,
    });
  }

  // Logout user
  static async logout(req: Request, res: Response): Promise<void> {
    await AuthService.logout(req.token!);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
}
