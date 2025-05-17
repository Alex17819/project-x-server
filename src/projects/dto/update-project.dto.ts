import { IsJSON } from "class-validator";

export class UpdateProjectDto {
  @IsJSON()
  blocks: string;
}
