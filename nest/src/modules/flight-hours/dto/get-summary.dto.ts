import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetFlightHoursSummaryDto {
  @IsOptional()
  @IsString()
  @IsIn(['1w', '1m', '3m', '6m', '1y'], {
    message: 'range must be one of: 1w, 1m, 3m, 6m, 1y'
  })
  range?: '1w' | '1m' | '3m' | '6m' | '1y' = '1w';
}
