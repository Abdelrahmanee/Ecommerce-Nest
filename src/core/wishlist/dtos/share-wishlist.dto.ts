import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayUnique, IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ShareWishlistDto {
    @ApiProperty({
      description: 'IDs of users to share the wishlist with',
      type: [String],
      example: ['60d5ec9af682fbd12a0dcd4d', '60d5ec9af682fbd12a0dcd4e']
    })
    @IsNotEmpty()
    @IsArray()
    @IsMongoId({ each: true })
    @ArrayUnique()
    userIds: string[];
  

    @ApiPropertyOptional({
      description: 'Message to include with the share',
      example: 'Check out these products I\'m interested in!'
    })
    @IsOptional()
    @IsString()
    message?: string;
  }