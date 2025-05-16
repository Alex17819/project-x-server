import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { BaseAuthDto, RegisterDto } from "./dto/auth.dto";
import { RefreshAccessTokenDto } from "./dto/refresh-access-token.dto";
import { JwtAuthGuard } from "./jwt/jwt-auth.guard";
import { Roles } from "./roles/roles.decorator";
import { RolesGuard } from "./roles/roles.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto, @Res() response: Response) {
    const { accessToken, refreshToken } =
      await this.authService.register(registerDto);

    response.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
      sameSite: "strict",
      path: "/",
    });

    response.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "strict",
      path: "/",
    });

    return response.json({
      message: "Successfully registered",
    });
  }

  @Post("login")
  async login(@Body() authDto: BaseAuthDto, @Res() response: Response) {
    const { accessToken, refreshToken } = await this.authService.login(authDto);

    response.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
      sameSite: "strict",
      path: "/",
    });

    response.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "strict",
      path: "/",
    });

    return response.json({
      message: "Successfully entered",
    });
  }

  @Post("logout")
  async logout(@Res() response: Response) {
    response.clearCookie("access_token", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    });

    response.clearCookie("refresh_token", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    });

    return response.json({ message: "Successfully logged out" });
  }

  @Get("protected")
  @UseGuards(JwtAuthGuard)
  async testProtected(@Req() req: Request) {
    return { message: "success" };
  }

  @Get("admin")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAdminData() {
    return { message: "Only for admins test" };
  }

  @Get("teacher")
  @Roles(Role.TEACHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getTeacherData() {
    return { message: "only for teachers test" };
  }

  @Get("refresh/access-token")
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const dto = {
      refreshToken: req.cookies["refresh_token"],
    };

    const { accessToken } = await this.authService.refreshAccessToken(dto);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
      sameSite: "strict",
      path: "/",
    });

    return res.json({
      message:
        "Successfully refreshed access token. Retrying previous request...",
    });
  }
}
