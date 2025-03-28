import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaModule } from "../prisma/prisma.module";
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [PrismaModule],
  controllers: [UserController],
})
export class UserModule {}
