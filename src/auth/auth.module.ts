import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { RolesGuard } from "./roles/roles.guard";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  imports: [PassportModule, JwtModule.register({}), UserModule, PrismaModule],
})
export class AuthModule {}
