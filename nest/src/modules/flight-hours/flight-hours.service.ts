import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { TODAY_DATE } from '../../common/constants';

export interface FlightHourRecord {
  date: string;
  hours: number;
}

export type RangeKey = '1w' | '1m' | '3m' | '6m' | '1y';

interface RangeConfig {
  limit: number;
  max: number;
  windowDays: number;
  displayRangeDays: number;
}

@Injectable()
export class FlightHoursService implements OnModuleInit {
  private flightHoursMap: Map<string, number> = new Map();
  private flightHoursList: FlightHourRecord[] = [];
  private chartBoundsConfig: Record<RangeKey, RangeConfig> = {
    '1w': { limit: 40, max: 45, windowDays: 7, displayRangeDays: 7 },
    '1m': { limit: 100, max: 125, windowDays: 30, displayRangeDays: 7 },
    '3m': { limit: 300, max: 325, windowDays: 90, displayRangeDays: 7 },
    '6m': { limit: 600, max: 625, windowDays: 180, displayRangeDays: 7 },
    '1y': { limit: 1050, max: 1200, windowDays: 365, displayRangeDays: 7 },
  };

  onModuleInit() {
    this.loadData();
  }

  private loadData() {
    try {
      const filePath = path.join(__dirname, '../../data/mock-flight-hours.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.flightHours && Array.isArray(parsed.flightHours)) {
          this.flightHoursList = parsed.flightHours;
          this.flightHoursMap.clear();
          for (const item of parsed.flightHours) {
            this.flightHoursMap.set(item.date, Number(item.hours) || 0);
          }
        }
        if (parsed.chartBounds) {
          this.chartBoundsConfig = {
            ...this.chartBoundsConfig,
            ...parsed.chartBounds,
          };
        }
      }
    } catch (err) {
      console.warn('Error loading mock-flight-hours.json:', err);
    }
  }

  getFlightHoursInRange(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const result: FlightHourRecord[] = [];
    const cur = new Date(fromDate);

    while (cur <= toDate) {
      const dStr = cur.toISOString().slice(0, 10);
      result.push({
        date: dStr,
        hours: this.flightHoursMap.get(dStr) || 0,
      });
      cur.setUTCDate(cur.getUTCDate() + 1);
    }

    return result;
  }

  // this is a rolling sum calculation :)
  rollingWindowBluffing(range: RangeKey = '1w') {
    const config = this.chartBoundsConfig[range] || this.chartBoundsConfig['1w'];
    const windowDays = config.windowDays;
    const halfDisplay = config.displayRangeDays || 7;

    const anchorDate = new Date(TODAY_DATE);

    // X-Axis: 7 days before today, today, and 7 days after today (centered on today)
    const points: Array<{
      date: string;
      dayLabel: string;
      flightHours: number;
      rollingSum: number;
      isToday: boolean;
    }> = [];

    for (let offset = -halfDisplay; offset <= halfDisplay; offset++) {
      const targetDate = new Date(anchorDate);
      targetDate.setUTCDate(targetDate.getUTCDate() + offset);
      const targetDateStr = targetDate.toISOString().slice(0, 10);

      // Rolling sum window of `windowDays` up to `targetDate`
      let rollingSum = 0;
      for (let w = 0; w < windowDays; w++) {
        const windowDate = new Date(targetDate);
        windowDate.setUTCDate(windowDate.getUTCDate() - w);
        const windowDateStr = windowDate.toISOString().slice(0, 10);
        const hours = this.flightHoursMap.get(windowDateStr) || 0;
        rollingSum += hours;
      }

      const dailyHours = this.flightHoursMap.get(targetDateStr) || 0;
      const isToday = offset === 0;

      points.push({
        date: targetDateStr,
        dayLabel: this.formatShortDate(targetDateStr),
        flightHours: Math.round(dailyHours * 10) / 10,
        rollingSum: Math.round(rollingSum * 10) / 10,
        isToday,
      });
    }

    // Limit cards metrics calculated as of today (15 May 2026)
    const limitCards = {
      daily: {
        current: Math.round((this.flightHoursMap.get(TODAY_DATE) || 0) * 10) / 10,
        limit: 8,
        window: 'Today only',
      },
      weekly: {
        current: this.calculateRollingSumAsOf(anchorDate, 7),
        limit: 40,
        window: 'Rolling 7d',
      },
      monthly: {
        current: this.calculateRollingSumAsOf(anchorDate, 30),
        limit: 100,
        window: 'Rolling 30d',
      },
      annual: {
        current: this.calculateRollingSumAsOf(anchorDate, 365),
        limit: 1050,
        window: 'Rolling 365d',
      },
    };

    return {
      range,
      sumWindowDays: windowDays,
      limitLine: config.limit,
      chartYMax: config.max,
      today: TODAY_DATE,
      points,
      limitCards,
    };
  }

  private calculateRollingSumAsOf(anchor: Date, days: number): number {
    let sum = 0;
    for (let i = 0; i < days; i++) {
      const d = new Date(anchor);
      d.setUTCDate(d.getUTCDate() - i);
      const dStr = d.toISOString().slice(0, 10);
      sum += this.flightHoursMap.get(dStr) || 0;
    }
    return Math.round(sum * 10) / 10;
  }

  private formatShortDate(dateStr: string): string {
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const m = parseInt(parts[1], 10) - 1;
    return `${parts[2]} ${months[m] || parts[1]}`;
  }
}
