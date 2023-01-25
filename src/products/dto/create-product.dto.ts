import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  IsIn,
  IsArray,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product Title (unique)',
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;
  @ApiProperty({
    description: 'Product Price',
    nullable: true,
    minLength: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Product Description',
    nullable: true,
    minLength: 10,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Product Slug',
    nullable: true,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Product Stock`',
    nullable: true,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Product Stock`',
    nullable: false,
    minimum: 1,
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    description: 'Product gender`',
    nullable: false,
  })
  @IsIn(['Men', 'Women', 'Kid', 'Unisex'])
  gender: string;

  @ApiProperty({
    description: 'Product gender`',
    nullable: true,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    description: 'Product gender`',
    nullable: true,
    minimum: 1,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
