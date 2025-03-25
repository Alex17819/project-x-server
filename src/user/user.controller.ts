import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req: Request) {
    const user = req.user as { userId: number };
    return await this.userService.getUserById(user?.userId);
  }
}
