// import { ApiProperty } from "@nestjs/swagger";
// import { Type } from "class-transformer";
// import { ValidateNested } from "class-validator";

// export class RecommendationResponseDto {
//     /**
//      * Recommended products
//      */
//     @ApiProperty({
//       description: 'Recommended products',
//       type: [ProductDto]
//     })
//     @ValidateNested({ each: true })
//     @Type(() => ProductDto)
//     recommendations: ProductDto[];
  
//     /**
//      * Recommendation basis description
//      * @example "Based on your interest in wireless audio products"
//      */
//     @ApiProperty({
//       description: 'Recommendation basis description',
//       example: 'Based on your interest in wireless audio products'
//     })
//     recommendationBasis: string;
//   }