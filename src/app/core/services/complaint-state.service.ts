import { Injectable, signal } from '@angular/core';

import { AIAnalysisResponse } from './ai.service';

export interface ComplaintDraft {
  mobileNumber: string;
  type?: 'women' | 'fraud';
  whatHappenedText?: string;
  whatHappenedAudioBase64?: string;
  aiAnalysis?: AIAnalysisResponse;
  answers?: Record<string, string>; // To store answers to dynamic questions
  rawImages?: Record<string, string>; // To store base64 images keyed by question id
  basicDetails?: {
    name: string;
    address: string;
    idImageBase64?: string | null;
    idType?: string | null;
    idNameMatch?: boolean;
  };
  isAnonymous?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintStateService {
  private readonly STORAGE_KEY = 'ncrc_drafts';
  private readonly CURRENT_USER_KEY = 'ncrc_current_user';

  // State signals
  public readonly currentUserMobile = signal<string | null>(this.getStoredMobile());
  public readonly currentDraft = signal<ComplaintDraft | null>(this.loadDraft());

  constructor() {}

  /** Login as a user and initialize their draft */
  login(mobile: string) {
    localStorage.setItem(this.CURRENT_USER_KEY, mobile);
    this.currentUserMobile.set(mobile);
    
    let draft = this.loadDraft(mobile);
    if (!draft) {
      draft = { mobileNumber: mobile };
      this.saveDraft(draft);
    }
    this.currentDraft.set(draft);
  }

  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserMobile.set(null);
    this.currentDraft.set(null);
  }

  updateDraft(updates: Partial<ComplaintDraft>) {
    const draft = this.currentDraft();
    if (draft) {
      const updated = { ...draft, ...updates };
      this.saveDraft(updated);
      this.currentDraft.set(updated);
    }
  }

  private getStoredMobile(): string | null {
    return localStorage.getItem(this.CURRENT_USER_KEY);
  }

  private loadDraft(mobile?: string): ComplaintDraft | null {
    const targetMobile = mobile || this.getStoredMobile();
    if (!targetMobile) return null;

    const storedStr = localStorage.getItem(this.STORAGE_KEY);
    if (!storedStr) return null;

    try {
      const drafts: Record<string, ComplaintDraft> = JSON.parse(storedStr);
      return drafts[targetMobile] || null;
    } catch {
      return null;
    }
  }

  private saveDraft(draft: ComplaintDraft) {
    const storedStr = localStorage.getItem(this.STORAGE_KEY);
    let drafts: Record<string, ComplaintDraft> = {};
    if (storedStr) {
      try {
        drafts = JSON.parse(storedStr);
      } catch (e) {}
    }
    drafts[draft.mobileNumber] = draft;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(drafts));
  }

  // Helper to convert blob to base64 so it can be stored in localStorage
  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
