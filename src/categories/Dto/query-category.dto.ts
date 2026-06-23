// categories/dto/update-category.dto.ts
import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;
}