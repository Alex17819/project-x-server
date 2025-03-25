import { Module } from "@nestjs/common";

import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [PrismaModule],
})
export class ProjectsModule {}
