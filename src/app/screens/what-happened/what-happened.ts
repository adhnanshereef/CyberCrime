import { Component, inject, signal, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { ComplaintStateService } from '../../core/services/complaint-state.service';
import { AiService } from '../../core/services/ai.service';

@Component({
  selector: 'app-what-happened',
  imports: [FormsModule],
  template: `
    <div class="screen-container bg-vibrant-blue">
      <div class="wave-bg"></div>
      
      <div class="content-wrapper">
        <header class="screen-header">
          <h1>{{ languageService.screens().whatHappenedTitle }}</h1>
          <p class="desc">{{ languageService.screens().whatHappenedDesc }}</p>
          
          @if (languageService.activeLanguage().code !== 'en') {
            <div class="english-fallback-group">
              <span class="fallback-title">Tell us what happened</span>
              <span class="fallback-desc">How would you like to explain?</span>
            </div>
          }
        </header>
        
        <main class="input-card">
          <!-- Mode Selector -->
          <div class="mode-selector">
            <button 
              type="button" 
              class="mode-btn" 
              [class.active]="inputType() === 'text'"
              (click)="setInputType('text')">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              {{ languageService.screens().typeText }}
            </button>
            <button 
              type="button" 
              class="mode-btn" 
              [class.active]="inputType() === 'voice'"
              (click)="setInputType('voice')">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>
              {{ languageService.screens().recordVoice }}
            </button>
          </div>

          <!-- Text Mode -->
          @if (inputType() === 'text') {
            <div class="text-input-container">
              <textarea 
                [(ngModel)]="textContent" 
                [placeholder]="languageService.screens().textPlaceholder"
                rows="6"
                class="what-happened-textarea">
              </textarea>
            </div>
          }

          <!-- Voice Mode -->
          @if (inputType() === 'voice') {
            <div class="voice-input-container">
              @if (permissionError()) {
                <div class="permission-error">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p>{{ permissionError() }}</p>
                  <button class="retry-btn" (click)="requestMicPermission()">Try Again</button>
                </div>
              } @else {
                
                @if (audioUrl()) {
                  <!-- Custom Playback UI -->
                  <div class="playback-container">
                    <p class="success-text">Recording Saved!</p>
                    
                    <audio #audioPlayer [src]="audioUrl()" (ended)="handleAudioEnd()" (pause)="isPlaying.set(false)" (play)="isPlaying.set(true)" hidden></audio>
                    
                    <div class="custom-audio-player">
                      <button class="play-pause-btn" (click)="togglePlay()">
                        @if (isPlaying()) {
                          <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        } @else {
                          <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        }
                      </button>
                      
                      <div class="bars">
                        @for (level of audioLevels(); track $index) {
                          <div class="bar playback-bar" [style.height.%]="level"></div>
                        }
                      </div>

                      <button class="delete-btn" (click)="resetRecording()" aria-label="Delete recording">
                        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                } @else {
                  <!-- Recording UI -->
                  <div class="visualizer-container">
                    <div class="bars">
                      @for (level of audioLevels(); track $index) {
                        <div class="bar record-bar" [style.height.%]="level"></div>
                      }
                    </div>
                    <p class="recording-status" [class.is-recording]="isRecording()">
                      {{ isRecording() ? languageService.screens().recording : languageService.screens().holdToTalk }}
                    </p>
                  </div>

                  <button 
                    class="record-btn" 
                    [class.recording]="isRecording()"
                    (pointerdown)="startRecording($event)"
                    (pointerup)="stopRecording()"
                    (pointercancel)="stopRecording()"
                    (pointerleave)="stopRecording()"
                    (contextmenu)="preventContextMenu($event)">
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>
                  </button>
                }
              }
            </div>
          }
        </main>
      </div>

      <div class="bottom-action-bar">
        <div class="action-pill">
          <button class="back-btn" (click)="goBack()" aria-label="Go back">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <button class="next-btn" (click)="goNext()" [disabled]="!canProceed()">
            @if (isLoading()) { Processing... } @else { Next }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .bg-vibrant-blue {
      background-color: #0d47a1;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      color: white;
    }
    .wave-bg {
      position: absolute;
      top: 0; left: 0; right: 0; height: 50%;
      background-color: #1976d2; 
      border-bottom-left-radius: 50% 20%;
      border-bottom-right-radius: 50% 20%;
      z-index: 0;
    }
    .content-wrapper {
      position: relative;
      z-index: 1;
      flex: 1;
      padding: calc(88px + 2rem) 1rem 7rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
    }
    .screen-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    h1 {
      font-size: 2.2rem;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    .desc {
      font-size: 1.1rem;
      color: rgba(255,255,255,0.9);
    }
    .english-fallback-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.2);
    }
    .fallback-title {
      font-size: 1rem;
      color: rgba(255,255,255,0.9);
    }
    .fallback-desc {
      font-size: 0.9rem;
      color: rgba(255,255,255,0.7);
    }

    /* Solid Color Input Card */
    .input-card {
      background: white;
      border-radius: 20px;
      padding: 1.5rem;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      color: var(--color-text-primary);
    }
    .mode-selector {
      display: flex;
      gap: 1rem;
    }
    .mode-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #f5f5f5;
      border: 2px solid transparent;
      border-radius: 12px;
      color: var(--color-text-secondary);
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
    }
    .mode-btn.active {
      background: #e3f2fd;
      border-color: #1976d2;
      color: #0d47a1;
      box-shadow: 0 4px 12px rgba(13, 71, 161, 0.1);
    }

    .what-happened-textarea {
      width: 100%;
      padding: 1rem;
      background: #f9f9f9;
      color: var(--color-text-primary);
      border: 2px solid var(--color-border);
      border-radius: 8px;
      font-family: inherit;
      font-size: 1.1rem;
      resize: vertical;
      outline: none;
    }
    .what-happened-textarea::placeholder {
      color: var(--color-text-secondary);
    }
    .what-happened-textarea:focus {
      border-color: #1976d2;
      background: white;
    }

    .voice-input-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      padding: 1rem 0;
    }
    .permission-error {
      text-align: center;
      color: #d32f2f;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      background: #ffebee;
      padding: 1.5rem;
      border-radius: 12px;
    }
    .retry-btn {
      padding: 0.75rem 1.5rem;
      background: #d32f2f;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
    }

    .visualizer-container {
      height: 80px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
    }
    .bars {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      height: 40px;
      flex: 1;
      justify-content: center;
    }
    .bar {
      width: 6px;
      border-radius: 3px;
      transition: height 0.05s ease;
      min-height: 4px;
    }
    .record-bar {
      background-color: #1976d2;
    }
    .playback-bar {
      background-color: #0d47a1;
    }
    .recording-status {
      font-weight: bold;
      color: var(--color-text-secondary);
    }
    .recording-status.is-recording {
      color: #d32f2f;
      animation: pulse 1s infinite alternate;
    }
    @keyframes pulse {
      from { opacity: 1; }
      to { opacity: 0.5; }
    }

    .record-btn {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #f5f5f5;
      color: #1976d2;
      border: 4px solid #1976d2;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none; /* Prevent scroll only while long pressing the button */
      transition: all 0.2s;
    }
    .record-btn.recording {
      background: #d32f2f;
      border-color: #b71c1c;
      color: white;
      transform: scale(1.1);
      box-shadow: 0 0 20px rgba(211, 47, 47, 0.5);
    }
    
    .playback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      width: 100%;
    }
    .success-text {
      color: #2e7d32;
      font-weight: bold;
    }
    .custom-audio-player {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #f5f5f5;
      padding: 0.75rem;
      border-radius: 50px;
      width: 100%;
    }
    .play-pause-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #1976d2;
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .delete-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ffebee;
      color: #d32f2f;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .bottom-action-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      display: flex;
      justify-content: center;
      background: linear-gradient(to top, rgba(13, 71, 161, 0.95), transparent);
      z-index: 10;
    }
    .action-pill {
      display: flex;
      background: white;
      border-radius: 50px;
      overflow: hidden;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.25);
    }
    .back-btn {
      padding: 1rem 1.5rem;
      background: transparent;
      color: #0d47a1;
      border: none;
      border-right: 2px solid rgba(13, 71, 161, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s;
    }
    .back-btn:hover { background: #e3f2fd; }
    .next-btn {
      flex: 1;
      background: transparent;
      color: #0d47a1;
      border: none;
      font-weight: bold;
      font-size: 1.15rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .next-btn:hover:not(:disabled) { background: #e3f2fd; }
    .next-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  `
})
export class WhatHappenedComponent implements OnDestroy {
  protected readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly stateService = inject(ComplaintStateService);

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
  protected readonly isLoading = signal(false);
  private readonly aiService = inject(AiService);

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
    if (this.isLoading()) return false;
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

  protected async requestMicPermission() {
    this.permissionError.set(null);
    
    // Check for Secure Context which is strictly required for getUserMedia
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

    this.isRecording.set(true); // SET FLAG FIRST so visualizer doesn't instantly die
    this.setupVisualizer(this.stream);

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

      // Enforce 29s limit to avoid exceeding Sarvam limits
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

    // Explicitly remove it from the saved draft so it doesn't come back on refresh
    this.stateService.updateDraft({ 
      whatHappenedAudioBase64: undefined 
    });
    
    // Attempt to get mic stream ready again
    if (!this.stream && !this.permissionError()) {
      this.requestMicPermission();
    }
  }

  protected togglePlay() {
    if (!this.audioElRef) return;
    const el = this.audioElRef.nativeElement;
    if (el.paused) {
      this.isPlaying.set(true); // SET FLAG FIRST
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
    
    // 1. Keep reference on class so it doesn't get garbage collected!
    this.micSource = this.audioContext.createMediaStreamSource(source);
    this.analyser = this.audioContext.createAnalyser();
    
    // 2. Some browsers optimize away nodes that don't connect to a destination.
    // We connect a GainNode to the destination with 0 volume (mute) to force audio processing
    // without causing a speaker feedback loop!
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

    // Wrap in try-catch in case of multiple connections causing InvalidStateError
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
      // Must check both flags to see if we should stop
      if (!this.isRecording() && !this.isPlaying()) {
        this.audioLevels.set(Array(20).fill(10));
        return; // Terminate loop
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
    
    draw(); // Start loop
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

    this.isLoading.set(true);

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
      
      // Store AI results in state
      if (aiResponse) {
        this.stateService.updateDraft({
          aiAnalysis: aiResponse
        } as any); // cast as any to bypass types for now until we update ComplaintDraft interface
        
        // Navigate to dynamic questions
        this.router.navigate(['/questions']);
      }
    } catch (err) {
      console.error('AI Processing Failed', err);
      alert('Error processing complaint. Please check API keys or try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected goBack(): void {
    this.location.back();
  }
}
