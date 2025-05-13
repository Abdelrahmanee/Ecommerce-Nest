import { Transform } from "class-transformer";


export class CouponCodeDto {
    @Transform(({ value }) => value?.toUpperCase().trim())
    code: string;
}