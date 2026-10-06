import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class GetSchedulesDto {
  @IsNotEmpty({ message: 'year parameter is required' })
  @IsString()
  @Matches(/^\d{4}$/, { message: 'year must be a 4-digit number (e.g. 2026)' })
  year!: string;

  @IsNotEmpty({ message: 'month parameter is required' })
  @IsString()
  @Matches(/^(0[1-9]|1[0-2]|[1-9])$/, { message: 'month must be between 01 and 12' })
  month!: string;
}
