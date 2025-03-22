import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { UploadFileDto } from "./dto/upload-file.dto";
import { FilesService } from "./files.service";
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";
import { Roles } from "../auth/roles/roles.decorator";
import { RolesGuard } from "../auth/roles/roles.guard";
import { Role } from "@prisma/client";
import { Request } from "express";

@Controller("files")
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Post("upload")
  // @Roles(Role.TEACHER)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async uploadFile(
    @Body() uploadFileDto: UploadFileDto,
    @Req() request: Request,
  ) {
    console.log(request.user);
    return await this.fileService.uploadFile(uploadFileDto);
  }

  @Get()
  async getFileNames() {
    return await this.fileService.getFileLinks();
  }
}
