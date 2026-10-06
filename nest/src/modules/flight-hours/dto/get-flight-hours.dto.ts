import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class GetFlightHoursDto {
  @IsNotEmpty({ message: 'from date is required' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'from date must be in YYYY-MM-DD format' })
  from!: string;

  @IsNotEmpty({ message: 'to date is required' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'to date must be in YYYY-MM-DD format' })
  to!: string;
}
