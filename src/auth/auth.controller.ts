import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { BaseAuthDto, RegisterDto } from "./dto/auth.dto";
import { RefreshAccessTokenDto } from "./dto/refresh-access-token.dto";
import { JwtAuthGuard } from "./jwt/jwt-auth.guard";
import { Roles } from "./roles/roles.decorator";
import { Role } from "@prisma/client";
import { RolesGuard } from "./roles/roles.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post("login")
  async login(@Body() authDto: BaseAuthDto) {
    return await this.authService.login(authDto);
  }

  @Get("protected")
  @UseGuards(JwtAuthGuard)
  async testProtected() {
    return "success";
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

  @Post("refresh/access-token")
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ) {
    return await this.authService.refreshAccessToken(refreshAccessTokenDto);
  }
}
