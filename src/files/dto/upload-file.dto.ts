import { IsString } from "class-validator";

export class UploadFileDto {
  @IsString()
  base64: string;

  @IsString()
  filename: string;
}
