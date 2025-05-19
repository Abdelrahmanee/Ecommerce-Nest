import { Transform } from "class-transformer";
import { IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CouponCodeDto {
    @ApiProperty({
        description: 'Coupon code',
        example: 'SUMMER2023'
    })
    @IsString()
    @Matches(/^[A-Z0-9_-]{3,20}$/, {
        message: 'Code must be 3-20 uppercase letters, numbers, underscore or hyphen'
    })
    @Transform(({ value }) => value?.toUpperCase().trim())
    code: string;
}