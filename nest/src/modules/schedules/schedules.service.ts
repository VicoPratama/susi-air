import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { TODAY_DATE } from '../../common/constants';

export interface ScheduleItem {
  duty_date: string;
  status: number;
  base_name: string;
  base_color: string;
  duty_type: string;
  count_schedules: number;
  count_logbooks: number;
}

export interface LegendItem {
  code: string;
  label: string;
  color: string;
}

@Injectable()
export class SchedulesService implements OnModuleInit {
  private rawSchedules: ScheduleItem[] = [];
  private rawLegend: LegendItem[] = [];

  onModuleInit() {
    this.loadData();
  }

  private loadData() {
    try {
      const filePath = path.join(__dirname, '../../data/mock-schedules.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.rawSchedules = parsed.schedules || [];
        this.rawLegend = parsed.legend || [];
      }
    } catch (e) {
      console.warn('Error loading mock-schedules.json:', e);
    }
  }

  getSchedules(year: string, month: string) {
    const paddedMonth = month.padStart(2, '0');
    const targetPrefix = `${year}-${paddedMonth}`;

    const filtered = this.rawSchedules.filter((item) =>
      item.duty_date.startsWith(targetPrefix),
    );

    return {
      today: TODAY_DATE,
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      schedules: filtered,
      legend: this.rawLegend,
    };
  }
}
