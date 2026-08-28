import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface AIAnalysisResponse {
  extracted_details: {
    category: string | null;
    incident_date: string | null;
    amount_lost: number | null;
    platform: string | null;
    suspect_info: string | null;
  };
  follow_up_questions: Array<{
    id: string;
    question: string;
    type: 'text' | 'select' | 'file_or_text';
    options?: string[];
    condition?: any;
  }>;
  original_transcript?: string;
}

export interface ScreenshotAnalysisResponse {
  utr_transaction_id: string | null;
  bank_or_app_name: string | null;
  amount: number | null;
  transaction_date: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  
  private async invokeFunction<T>(functionName: string, body: any): Promise<T> {
    const url = `${environment.supabaseUrl}/functions/v1/${functionName}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${environment.supabaseKey}`
      },
      body: JSON.stringify(body)
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to call ${functionName}`);
    }
    
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Unknown AI error');
    }
    
    return data.data as T;
  }

  async processComplaint(type: 'text' | 'voice', payload: string): Promise<AIAnalysisResponse> {
    return this.invokeFunction<AIAnalysisResponse>('process-complaint', { type, payload });
  }

  async processScreenshot(imageBase64: string): Promise<ScreenshotAnalysisResponse> {
    return this.invokeFunction<ScreenshotAnalysisResponse>('process-screenshot', { imageBase64 });
  }
}
