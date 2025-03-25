import { IsJSON } from "class-validator";

export class CreateProjectDto {
  @IsJSON()
  blocks: string;
}
