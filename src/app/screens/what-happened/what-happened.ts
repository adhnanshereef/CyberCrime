import { Component, inject, signal, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { ComplaintStateService } from '../../core/services/complaint-state.service';
import { AiService } from '../../core/services/ai.service';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-what-happened',
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-background text-on-background flex flex-col font-primary">
      <main class="flex-grow flex flex-col items-center max-w-3xl mx-auto w-full px-6 pt-12 pb-32">
        
        <header class="text-center mb-10 w-full">
          <h1 class="text-4xl md:text-5xl font-bold text-primary mb-3">
            {{ languageService.screens().whatHappenedTitle }}
          </h1>
          <p class="text-xl text-text-secondary font-sans mb-4">
            {{ languageService.screens().whatHappenedDesc }}
          </p>
          @if (languageService.activeLanguage().code !== 'en') {
            <div class="w-full max-w-sm mx-auto pt-4 border-t border-border">
              <span class="block text-sm font-bold text-text-primary">Tell us what happened</span>
              <span class="block text-xs text-text-secondary font-sans">How would you like to explain?</span>
            </div>
          }
        </header>
        
        <div class="w-full bg-surface border-2 border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-8">
          
          <!-- Mode Selector -->
          <div class="flex flex-col sm:flex-row gap-4 bg-surface-container-low p-2 rounded-2xl">
            <button 
              type="button" 
              class="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary"
              [class.bg-surface]="inputType() === 'text'"
              [class.shadow-md]="inputType() === 'text'"
              [class.text-primary]="inputType() === 'text'"
              [class.text-text-secondary]="inputType() !== 'text'"
              [class.hover:bg-surface/50]="inputType() !== 'text'"
              (click)="setInputType('text')">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              {{ languageService.screens().typeText }}
            </button>
            <button 
              type="button" 
              class="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary"
              [class.bg-surface]="inputType() === 'voice'"
              [class.shadow-md]="inputType() === 'voice'"
              [class.text-primary]="inputType() === 'voice'"
              [class.text-text-secondary]="inputType() !== 'voice'"
              [class.hover:bg-surface/50]="inputType() !== 'voice'"
              (click)="setInputType('voice')">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>
              {{ languageService.screens().recordVoice }}
            </button>
          </div>

          <!-- Text Mode -->
          @if (inputType() === 'text') {
            <div class="flex flex-col gap-2 animate-fade-in">
              <textarea 
                [(ngModel)]="textContent" 
                [placeholder]="languageService.screens().textPlaceholder"
                rows="6"
                class="w-full bg-background border-2 border-border rounded-2xl p-6 text-xl font-sans focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none placeholder-text-secondary/50">
              </textarea>
            </div>
          }

          <!-- Voice Mode -->
          @if (inputType() === 'voice') {
            <div class="flex flex-col items-center gap-8 py-6 animate-fade-in">
              @if (permissionError()) {
                <div class="flex flex-col items-center text-center p-6 bg-red-50 text-urgent border border-urgent/20 rounded-2xl gap-4 w-full">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p class="font-sans font-bold">{{ permissionError() }}</p>
                  <button class="bg-urgent text-white px-6 py-2 rounded-xl font-bold hover:bg-urgent/90 transition-colors shadow-sm" (click)="requestMicPermission()">Try Again</button>
                </div>
              } @else {
                
                @if (audioUrl()) {
                  <!-- Custom Playback UI -->
                  <div class="w-full flex flex-col items-center gap-6">
                    <div class="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full font-bold">
                      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                      Recording Saved!
                    </div>
                    
                    <audio #audioPlayer [src]="audioUrl()" (ended)="handleAudioEnd()" (pause)="isPlaying.set(false)" (play)="isPlaying.set(true)" hidden></audio>
                    
                    <div class="w-full flex items-center gap-4 bg-surface-container-low p-3 md:p-4 rounded-full border border-border shadow-inner">
                      <button class="w-14 h-14 shrink-0 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md outline-none focus-visible:ring-4 focus-visible:ring-primary/50" (click)="togglePlay()">
                        @if (isPlaying()) {
                          <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        } @else {
                          <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        }
                      </button>
                      
                      <div class="flex-1 flex items-center justify-center gap-1 h-12 overflow-hidden">
                        @for (level of audioLevels(); track $index) {
                          <div class="w-1.5 md:w-2 rounded-full bg-primary transition-all duration-75" [style.height.%]="level"></div>
                        }
                      </div>

                      <button class="w-12 h-12 shrink-0 rounded-full bg-surface text-urgent border border-urgent/30 flex items-center justify-center hover:bg-urgent/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-urgent" (click)="resetRecording()" aria-label="Delete recording">
                        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                } @else {
                  <!-- Recording UI -->
                  <div class="w-full flex flex-col items-center justify-center gap-10">
                    <div class="h-24 w-full flex flex-col justify-end items-center gap-4">
                      <div class="flex-1 flex items-end justify-center gap-1.5 w-full">
                        @for (level of audioLevels(); track $index) {
                          <div class="w-2 rounded-full transition-all duration-75 min-h-[4px]" 
                               [class.bg-urgent]="isRecording()" 
                               [class.bg-primary]="!isRecording()" 
                               [style.height.%]="level">
                          </div>
                        }
                      </div>
                      <p class="font-bold font-sans transition-colors duration-300" 
                         [class.text-urgent]="isRecording()" 
                         [class.animate-pulse]="isRecording()"
                         [class.text-text-secondary]="!isRecording()">
                        {{ isRecording() ? languageService.screens().recording : languageService.screens().holdToTalk }}
                      </p>
                    </div>

                    <button 
                      class="relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer select-none transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
                      [class.bg-surface-container-highest]="!isRecording()"
                      [class.text-primary]="!isRecording()"
                      [class.bg-urgent]="isRecording()"
                      [class.text-white]="isRecording()"
                      [class.scale-110]="isRecording()"
                      [class.shadow-2xl]="isRecording()"
                      [class.shadow-urgent]="isRecording()"
                      (pointerdown)="startRecording($event)"
                      (pointerup)="stopRecording()"
                      (pointercancel)="stopRecording()"
                      (pointerleave)="stopRecording()"
                      (contextmenu)="preventContextMenu($event)">
                      
                      <!-- Ripple rings when recording -->
                      @if (isRecording()) {
                        <div class="absolute inset-0 rounded-full border-4 border-urgent animate-ping opacity-50"></div>
                        <div class="absolute inset-[-10px] rounded-full border-2 border-urgent animate-ping opacity-25" style="animation-delay: 0.2s"></div>
                      }
                      
                      <svg aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" class="relative z-10"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>
                    </button>
                  </div>
                }
              }
            </div>
          }
        </div>
      </main>

      <div class="fixed bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-background via-background/95 to-transparent z-10 pointer-events-none">
        <div class="flex bg-surface rounded-full overflow-hidden w-full max-w-sm shadow-xl border border-border pointer-events-auto">
          <button class="flex items-center justify-center px-6 py-4 bg-transparent text-primary hover:bg-surface-container-low transition-colors border-r border-border" (click)="goBack()" aria-label="Go back">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <button class="flex-1 bg-transparent text-primary font-bold text-xl hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed" (click)="goNext()" [disabled]="!canProceed()">
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `
})
export class WhatHappenedComponent implements OnDestroy {
  protected readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly stateService = inject(ComplaintStateService);
  private readonly uiState = inject(UiStateService);
  private readonly aiService = inject(AiService);

  protected readonly inputType = signal<'text' | 'voice' | null>(null);
  
  // Text state
  protected readonly textContent = signal('');
  
  // Voice state
  protected readonly isRecording = signal(false);
  protected readonly permissionError = signal<string | null>(null);
  protected readonly audioUrl = signal<string | null>(null);
  protected readonly audioLevels = signal<number[]>(Array(20).fill(10));
  
  // Playback state
  protected readonly isPlaying = signal(false);
  @ViewChild('audioPlayer') audioElRef?: ElementRef<HTMLAudioElement>;
  
  private audioBlob: Blob | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private animationFrameId: number | null = null;
  private stream: MediaStream | null = null;
  private playbackSource: MediaElementAudioSourceNode | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private muteNode: GainNode | null = null;
  private recordTimeout: any;

  constructor() {
    const draft = this.stateService.currentDraft();
    if (draft?.whatHappenedText) {
      this.inputType.set('text');
      this.textContent.set(draft.whatHappenedText);
    } else if (draft?.whatHappenedAudioBase64) {
      this.inputType.set('voice');
      this.audioUrl.set(draft.whatHappenedAudioBase64);
    }
  }

  ngOnDestroy() {
    this.cleanupAudio();
  }

  protected setInputType(type: 'text' | 'voice'): void {
    this.inputType.set(type);
    if (type === 'voice' && !this.stream && !this.audioUrl()) {
      this.requestMicPermission();
    }
  }

  protected canProceed(): boolean {
    if (this.inputType() === 'text') {
      return this.textContent().trim().length > 0;
    } else if (this.inputType() === 'voice') {
      return this.audioUrl() !== null;
    }
    return false;
  }

  protected preventContextMenu(event: Event) {
    event.preventDefault(); 
  }

  // --- Sound Effects ---
  private playSoundEffect(type: 'start' | 'stop') {
    if (!this.audioContext) return;
    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      if (type === 'start') {
        osc.frequency.setValueAtTime(440, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.1);
      } else {
        osc.frequency.setValueAtTime(880, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.15);
      }
    } catch (e) {
      console.warn('Could not play sound effect', e);
    }
  }

  protected async requestMicPermission() {
    this.permissionError.set(null);
    
    if (!window.isSecureContext) {
      this.permissionError.set('Microphone access requires a secure connection (HTTPS or localhost). You are currently using HTTP.');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      console.error('Error accessing mic:', err);
      this.permissionError.set(this.languageService.screens().permissionError);
    }
  }

  protected startRecording(event: PointerEvent) {
    const target = event.target as Element;
    if (target.releasePointerCapture) {
      target.releasePointerCapture(event.pointerId);
    }

    if (!this.stream || this.isRecording()) return;

    this.isRecording.set(true); 
    this.setupVisualizer(this.stream);
    
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume().then(() => this.playSoundEffect('start'));
    } else {
      this.playSoundEffect('start');
    }

    try {
      this.mediaRecorder = new MediaRecorder(this.stream);
      const chunks: BlobPart[] = [];

      this.mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(this.audioBlob);
        this.audioUrl.set(url);
      };

      this.mediaRecorder.start();

      this.recordTimeout = setTimeout(() => {
        if (this.isRecording()) {
          this.stopRecording();
        }
      }, 29000);

    } catch (err) {
      console.error('Failed to start recording', err);
      this.isRecording.set(false);
    }
  }

  protected stopRecording() {
    if (this.mediaRecorder && this.isRecording()) {
      this.playSoundEffect('stop');
      this.mediaRecorder.stop();
      this.isRecording.set(false);
      this.stopVisualizer();
      if (this.recordTimeout) clearTimeout(this.recordTimeout);
    }
  }

  protected resetRecording() {
    if (this.audioUrl() && !this.audioUrl()!.startsWith('data:')) {
      URL.revokeObjectURL(this.audioUrl()!);
    }
    this.audioUrl.set(null);
    this.audioBlob = null;
    this.audioLevels.set(Array(20).fill(10));
    this.isPlaying.set(false);

    this.stateService.updateDraft({ 
      whatHappenedAudioBase64: undefined 
    });
    
    if (!this.stream && !this.permissionError()) {
      this.requestMicPermission();
    }
  }

  protected togglePlay() {
    if (!this.audioElRef) return;
    const el = this.audioElRef.nativeElement;
    if (el.paused) {
      this.isPlaying.set(true);
      this.setupPlaybackVisualizer(el);
      el.play();
    } else {
      el.pause();
      this.isPlaying.set(false);
    }
  }
  
  protected handleAudioEnd() {
    this.isPlaying.set(false);
  }

  private setupVisualizer(source: MediaStream) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    this.micSource = this.audioContext.createMediaStreamSource(source);
    this.analyser = this.audioContext.createAnalyser();
    
    this.muteNode = this.audioContext.createGain();
    this.muteNode.gain.value = 0;
    
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
    this.analyser.fftSize = 64;
    
    this.micSource.connect(this.analyser);
    this.analyser.connect(this.muteNode);
    this.muteNode.connect(this.audioContext.destination);
    
    this.startDrawingWave();
  }

  private setupPlaybackVisualizer(el: HTMLAudioElement) {
    if (this.playbackSource) {
      if (this.audioContext?.state === 'suspended') {
        this.audioContext.resume();
      }
      this.startDrawingWave();
      return; 
    }
    
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    try {
      this.playbackSource = this.audioContext.createMediaElementSource(el);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      this.playbackSource.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    } catch (e) {
      console.warn('Playback source already connected', e);
    }

    this.startDrawingWave();
  }

  private startDrawingWave() {
    if (!this.analyser) return;
    
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!this.isRecording() && !this.isPlaying()) {
        this.audioLevels.set(Array(20).fill(10));
        return; 
      }
      
      if (!this.analyser || !this.dataArray) return;
      
      this.animationFrameId = requestAnimationFrame(draw);
      this.analyser.getByteFrequencyData(this.dataArray as any);
      
      const newLevels = [];
      const step = Math.max(1, Math.floor(bufferLength / 20));
      for (let i = 0; i < 20; i++) {
        const val = this.dataArray[i * step] || 0;
        const boost = Math.pow(val / 255, 0.7); 
        const percent = Math.max(10, boost * 100);
        newLevels.push(percent);
      }
      this.audioLevels.set(newLevels);
    };
    
    draw(); 
  }

  private stopVisualizer() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    if (this.muteNode) {
      this.muteNode.disconnect();
      this.muteNode = null;
    }
    this.audioLevels.set(Array(20).fill(10));
  }

  private cleanupAudio() {
    this.stopVisualizer();
    if (this.recordTimeout) clearTimeout(this.recordTimeout);
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.audioUrl() && !this.audioUrl()!.startsWith('data:')) {
      URL.revokeObjectURL(this.audioUrl()!);
    }
  }

  protected async goNext() {
    if (!this.canProceed()) return;

    this.uiState.showProcessing('Processing your data, this might take some time...');

    try {
      let aiResponse: any;
      if (this.inputType() === 'text') {
        this.stateService.updateDraft({ 
          whatHappenedText: this.textContent(),
          whatHappenedAudioBase64: undefined
        });
        aiResponse = await this.aiService.processComplaint('text', this.textContent());
      } else if (this.inputType() === 'voice' && this.audioBlob) {
        const base64 = await this.stateService.blobToBase64(this.audioBlob);
        this.stateService.updateDraft({ 
          whatHappenedAudioBase64: base64,
          whatHappenedText: undefined
        });
        aiResponse = await this.aiService.processComplaint('voice', base64);
      }
      
      if (aiResponse) {
        this.stateService.updateDraft({
          aiAnalysis: aiResponse
        } as any); 
        
        this.router.navigate(['/questions']);
      }
    } catch (err) {
      console.error('AI Processing Failed', err);
      alert('Error processing complaint. Please check connection and try again.');
    } finally {
      this.uiState.hideProcessing();
    }
  }

  protected goBack(): void {
    this.location.back();
  }
}
