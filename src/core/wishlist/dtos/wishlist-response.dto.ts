// import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
// import { Type } from "class-transformer";
// import { ValidateNested } from "class-validator";
// import { CreateUserDto } from "src/core/user/dto/create-user.dto";

// export class WishlistResponseDto {
   
//     @ApiProperty({
//       description: 'ID of the wishlist',
//       example: '60d5ec9af682fbd12a0dcd50'
//     })
//     id: string;
  
    
//     @ApiProperty({
//       description: 'User who owns the wishlist',
//       type: CreateUserDto
//     })
//     @ValidateNested()
//     @Type(() => CreateUserDto)
//     user: CreateUserDto;
  
//     @ApiProperty({
//       description: 'Products in the wishlist',
//       type: [WishlistItemDto]
//     })
//     @ValidateNested({ each: true })
//     @Type(() => WishlistItemDto)
//     items: WishlistItemDto[];
  
//     @ApiProperty({
//       description: 'Number of products in the wishlist',
//       example: 5
//     })
//     productCount: number;
//     @ApiProperty({
//       description: 'Wishlist settings',
//       type: WishlistSettingsDto
//     })
//     @ValidateNested()
//     @Type(() => WishlistSettingsDto)
//     settings: WishlistSettingsDto;
  
    
//     @ApiProperty({
//       description: 'Date when the wishlist was created',
//       example: '2025-01-01T12:00:00.000Z'
//     })
//     createdAt: Date;
  
//     @ApiProperty({
//       description: 'Date when the wishlist was last updated',
//       example: '2025-01-15T14:30:00.000Z'
//     })
//     updatedAt: Date;
  
//     @ApiPropertyOptional({
//       description: 'URLs for sharing the wishlist',
//       example: {
//         publicUrl: 'https://example.com/wishlists/share/abc123',
//         embedCode: '<iframe src="https://example.com/embed/wishlist/abc123"></iframe>'
//       }
//     })
//     sharingOptions?: {
//       publicUrl?: string;
//       embedCode?: string;
//     };
//   }