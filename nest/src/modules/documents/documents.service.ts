import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { TODAY_DATE } from '../../common/constants';

export interface PilotDocumentItem {
  id: string;
  label: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'safe' | 'soon' | 'expired';
}

@Injectable()
export class DocumentsService implements OnModuleInit {
  private rawDocuments: any[] = [];
  private warningDays: number = 30;

  onModuleInit() {
    this.loadData();
  }

  private loadData() {
    try {
      const filePath = path.join(__dirname, '../../data/mock-documents.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.rawDocuments = parsed.documents || [];
        if (parsed.thresholds?.warningDays) {
          this.warningDays = parsed.thresholds.warningDays;
        }
      }
    } catch (e) {
      console.warn('Error loading mock-documents.json:', e);
    }
  }

  getDocuments() {
    const today = new Date(TODAY_DATE);
    const msPerDay = 1000 * 60 * 60 * 24;

    const processedDocuments: PilotDocumentItem[] = this.rawDocuments.map((doc) => {
      const expiry = new Date(doc.expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const daysRemaining = Math.ceil(diffTime / msPerDay);

      let status: 'safe' | 'soon' | 'expired';
      if (daysRemaining <= 0) {
        status = 'expired';
      } else if (daysRemaining <= this.warningDays) {
        status = 'soon';
      } else {
        status = 'safe';
      }

      return {
        id: doc.id,
        label: doc.label,
        expiryDate: doc.expiryDate,
        daysRemaining,
        status,
      };
    });

    return {
      today: TODAY_DATE,
      warningThresholdDays: this.warningDays,
      documents: processedDocuments,
    };
  }
}
