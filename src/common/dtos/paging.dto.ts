import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class RequestPagingQuery {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  take: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  pageIndex: number;

  @IsOptional()
  @IsString()
  orderBy: string;

  @Reflect.metadata('design:type', { name: 'string' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'ASC';
}

export class PagingInfo {
  @IsPositive()
  pageIndex?: number;

  @IsPositive()
  take?: number;

  @IsPositive()
  total?: number;
}

export class ResponsePagingDto<T> {
  @IsArray()
  @ValidateNested({ each: true })
  items: T[];

  @ValidateNested()
  nextPage: PagingInfo;

  @IsBoolean()
  isEnd: boolean;

  @IsNumber()
  total?: number;
}
