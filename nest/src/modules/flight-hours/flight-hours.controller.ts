import { Controller, Get, Query } from '@nestjs/common';
import { FlightHoursService } from './flight-hours.service';
import { GetFlightHoursDto } from './dto/get-flight-hours.dto';
import { GetFlightHoursSummaryDto } from './dto/get-summary.dto';

@Controller('flight-hours')
export class FlightHoursController {
  constructor(private readonly flightHoursService: FlightHoursService) {}

  @Get('summary')
  getSummary(@Query() query: GetFlightHoursSummaryDto) {
    return this.flightHoursService.rollingWindowBluffing(query.range || '1w');
  }

  @Get()
  getFlightHours(@Query() query: GetFlightHoursDto) {
    return this.flightHoursService.getFlightHoursInRange(query.from, query.to);
  }
}
