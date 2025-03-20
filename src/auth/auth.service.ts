import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { ConfigService } from "@nestjs/config";
import { AuthDto } from "./dto/auth.dto";
import { UserService } from "../user/user.service";
import { RefreshAccessTokenDto } from "./dto/refresh-access-token.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  private async comparePasswords(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await argon2.verify(hash, password);
  }

  private async generateTokens(userId: number) {
    const payload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_ACCESS_SECRET"),
      expiresIn: this.configService.get("JWT_ACCESS_EXPIRES_IN"),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN"),
    });

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(userId: number) {
    const payload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_ACCESS_SECRET"),
      expiresIn: this.configService.get("JWT_ACCESS_EXPIRES_IN"),
    });

    return { accessToken };
  }

  async register(registerDto: AuthDto) {
    const hashedPassword = await this.hashPassword(registerDto.password);
    const user = await this.userService.createUser(
      registerDto.email,
      hashedPassword,
    );

    return this.generateTokens(user.id);
  }

  async login(authDto: AuthDto) {
    const user = await this.userService.findUserByEmail(authDto.email);

    const isPasswordCorrect = await this.comparePasswords(
      authDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.generateTokens(user.id);
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async refreshAccessToken({ refreshToken }: RefreshAccessTokenDto) {
    const payload = await this.validateRefreshToken(refreshToken);
    return this.generateAccessToken(payload.sub);
  }
}
