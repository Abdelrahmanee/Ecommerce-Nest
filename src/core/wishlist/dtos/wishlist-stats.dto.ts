import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class WishlistStatsDto {
  
    @ApiProperty({
      description: 'Total value of all products in the wishlist',
      example: 549.95
    })
    totalValue: number;
  
  
    @ApiProperty({
      description: 'Average product price',
      example: 109.99
    })
    averagePrice: number;
  
   
    @ApiPropertyOptional({
      description: 'Most common product category',
      example: 'electronics'
    })
    mostCommonCategory?: string;
  
   
    @ApiProperty({
      description: 'Number of products currently on sale',
      example: 2
    })
    onSaleCount: number;
  
  
    @ApiProperty({
      description: 'Number of products currently out of stock',
      example: 1
    })
    outOfStockCount: number;
  
    
    @ApiPropertyOptional({
      description: 'Potential savings from current sales',
      example: 75.98
    })
    potentialSavings?: number;
  }