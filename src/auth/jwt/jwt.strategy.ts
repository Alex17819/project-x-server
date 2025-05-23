import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: (req) => req.cookies["access_token"],
      secretOrKey: configService.get("JWT_ACCESS_SECRET")!,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub };
  }
}
