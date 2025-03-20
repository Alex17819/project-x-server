import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { RefreshAccessTokenDto } from "./dto/refresh-access-token.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: AuthDto) {
    return await this.authService.register(registerDto);
  }

  @Post("login")
  async login(@Body() authDto: AuthDto) {
    return await this.authService.login(authDto);
  }

  @Post("refresh/access-token")
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ) {
    return await this.authService.refreshAccessToken(refreshAccessTokenDto);
  }
}
