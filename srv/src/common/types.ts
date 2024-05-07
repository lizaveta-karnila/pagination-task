import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PagingParamsDTO {
  @IsInt()
  @Min(0)
  @Type(() => Number)
  pageNumber: number;

  @IsInt()
  @Max(100)
  @Type(() => Number)
  pageSize: number;
};
