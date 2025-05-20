import { IsString } from "class-validator";

export class ShareProjectDto {
  @IsString()
  userId: string;

  @IsString()
  projectId: string;
}
