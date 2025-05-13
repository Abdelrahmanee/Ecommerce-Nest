import { IsMongoId, IsString } from "class-validator";

export class CreateCartDto {
    @IsMongoId()
    @IsString()
    userId: string;
  }