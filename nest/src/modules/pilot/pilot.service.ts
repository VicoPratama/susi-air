import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PILOT_ACCOUNT } from '../../common/constants';

@Injectable()
export class PilotService implements OnModuleInit {
  private pilotData: any = null;

  onModuleInit() {
    this.loadData();
  }

  private loadData() {
    try {
      const filePath = path.join(__dirname, '../../data/mock-flight-hours.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.pilotData = parsed.pilot;
      }
    } catch (e) {
      console.warn('Could not read mock-flight-hours.json, fallback to defaults', e);
    }
  }

  getProfile() {
    return {
      name: this.pilotData?.name || PILOT_ACCOUNT.name,
      totalFlightHours: this.pilotData?.totalFlightHours || PILOT_ACCOUNT.totalFlightHours,
      avatarUrl: PILOT_ACCOUNT.avatarUrl,
      rank: 'Captain',
      base: 'MKW (Manokwari) / CGK'
    };
  }
}
