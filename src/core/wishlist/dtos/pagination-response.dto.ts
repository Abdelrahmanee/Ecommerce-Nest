// import { ApiProperty } from "@nestjs/swagger";
// import { Type } from "class-transformer";
// import { ValidateNested } from "class-validator";
// import { WishlistResponseDto } from "./wishlist-response.dto";

// export class PaginatedWishlistResponseDto {
//     @ApiProperty({ description: 'Array of wishlist items', type: [WishlistResponseDto] })
//     @ValidateNested({ each: true })
//     @Type(() => WishlistResponseDto)
//     data: WishlistResponseDto[];

  
//     @ApiProperty({ description: 'Total number of items', example: 42 })
//     total: number;

//     @ApiProperty({ description: 'Current page number', example: 1 })
//     page: number;

//     @ApiProperty({ description: 'Number of items per page', example: 10 })
//     limit: number;

//     @ApiProperty({ description: 'Total number of pages', example: 5 })
//     totalPages: number;
// }