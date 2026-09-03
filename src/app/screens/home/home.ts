import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-background text-on-background flex flex-col font-primary relative overflow-hidden">
      
      <!-- Decorative Background Doodles -->
      <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <!-- Shield -->
        <svg class="absolute top-12 left-[10%] opacity-20 text-text-secondary w-24 h-24 rotate-[-12deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
        
        <!-- Voice/Mic -->
        <svg class="absolute top-32 right-[12%] opacity-20 text-text-secondary w-32 h-32 rotate-[15deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
        
        <!-- Magnifying Glass / Tech -->
        <svg class="absolute bottom-[40%] left-[5%] opacity-20 text-text-secondary w-28 h-28 rotate-[-25deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>

        <!-- Padlock / Security -->
        <svg class="absolute top-[40%] right-[5%] opacity-20 text-text-secondary w-20 h-20 rotate-[10deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>

      <main class="flex-grow flex flex-col items-center max-w-5xl mx-auto w-full px-6 pt-16 pb-24 z-10 relative">
        
        <!-- Demo Badge -->
        <div class="mb-8 inline-flex items-center gap-2 bg-primary-container text-on-primary px-4 py-1.5 rounded-full shadow-sm">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <span class="text-xs font-bold uppercase tracking-widest">Demo Version</span>
        </div>

        <!-- Hero Section -->
        <section class="text-center flex flex-col items-center gap-6 mb-16 w-full max-w-3xl">
          <h1 class="text-5xl md:text-7xl font-bold text-primary leading-tight font-serif tracking-tight">
            Speak Your Truth.<br />
            <span class="text-text-primary">We Will Listen.</span>
          </h1>
          <p class="text-xl md:text-2xl text-text-secondary font-sans leading-relaxed">
            Filing a cybercrime report is now easier than ever. 
            No more complex forms—simply <strong>record a voice message</strong> in your own language, and our AI assistant will instantly translate and file the complaint for you.
          </p>
        </section>

        <!-- Call to Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-6 w-full max-w-2xl mb-24">
          <!-- Register Button -->
          <a routerLink="/language" class="group flex-1 flex items-center justify-between bg-primary text-on-primary px-8 py-6 rounded-3xl shadow-md hover:-translate-y-1 hover:shadow-xl hover:bg-primary/95 transition-all duration-300">
            <div class="flex items-center gap-5">
              <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              <div class="flex flex-col items-start text-left">
                <span class="font-bold text-xl md:text-2xl font-serif">Register Complaint</span>
                <span class="text-white/80 font-sans text-sm mt-1">Start a new voice-guided report</span>
              </div>
            </div>
            <svg class="transform group-hover:translate-x-2 transition-transform duration-300 opacity-80" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>

          <!-- Track Button -->
          <a routerLink="/login" [queryParams]="{returnUrl: '/track'}" class="group flex-1 flex items-center justify-between bg-surface text-primary border-2 border-primary px-8 py-6 rounded-3xl shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div class="flex items-center gap-5">
              <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div class="flex flex-col items-start text-left">
                <span class="font-bold text-xl md:text-2xl font-serif">Track Progress</span>
                <span class="text-text-secondary font-sans text-sm mt-1">Check existing case status</span>
              </div>
            </div>
            <svg class="transform group-hover:translate-x-2 transition-transform duration-300 opacity-60 text-primary" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>

        <!-- Learning Corner -->
        <section class="w-full flex flex-col gap-8">
          <div class="flex items-center justify-between w-full">
            <div>
              <h2 class="text-3xl font-bold text-primary mb-2 font-serif flex items-center gap-3">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" class="text-accent"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Learning Corner
              </h2>
              <p class="text-lg text-text-secondary font-sans">Official resources to keep you safe in the digital world.</p>
            </div>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex items-center gap-2 text-accent font-bold hover:underline font-sans">
              View all resources
              <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            
            <!-- Card 1 -->
            <a href="https://cybercrime.gov.in/Webform/Crime_OnlineSafetyTips.aspx" target="_blank" rel="noopener noreferrer" class="group bg-surface border border-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow hover:border-primary/50 flex flex-col justify-between h-full">
              <div>
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 class="text-xl font-bold text-primary mb-2 font-serif group-hover:text-accent transition-colors">Cyber Safety Tips</h3>
                <p class="text-text-secondary font-sans text-sm leading-relaxed mb-6">Learn essential practices to protect your identity, finances, and privacy against modern digital threats.</p>
              </div>
              <div class="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wide group-hover:text-accent transition-colors">
                Read More 
                <svg class="transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </a>

            <!-- Card 2 -->
            <a href="https://cybercrime.gov.in/Webform/Advisory.aspx" target="_blank" rel="noopener noreferrer" class="group bg-surface border border-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow hover:border-primary/50 flex flex-col justify-between h-full">
              <div>
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <h3 class="text-xl font-bold text-primary mb-2 font-serif group-hover:text-accent transition-colors">Official Advisories</h3>
                <p class="text-text-secondary font-sans text-sm leading-relaxed mb-6">Stay informed with the latest official alerts regarding new scams, phishing trends, and malware outbreaks.</p>
              </div>
              <div class="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wide group-hover:text-accent transition-colors">
                Read More 
                <svg class="transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </a>

            <!-- Card 3 -->
            <a href="https://cybercrime.gov.in/Webform/training-resource.aspx" target="_blank" rel="noopener noreferrer" class="group bg-surface border border-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow hover:border-primary/50 flex flex-col justify-between h-full">
              <div>
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <h3 class="text-xl font-bold text-primary mb-2 font-serif group-hover:text-accent transition-colors">Training Resources</h3>
                <p class="text-text-secondary font-sans text-sm leading-relaxed mb-6">Access manuals, presentations, and interactive modules to educate your community about cyber wellness.</p>
              </div>
              <div class="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wide group-hover:text-accent transition-colors">
                Read More 
                <svg class="transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </a>

          </div>
          <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" class="sm:hidden flex items-center justify-center gap-2 text-accent font-bold hover:underline font-sans mt-4">
            View all resources
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </a>
        </section>

      </main>

      <!-- Footer -->
      <footer class="w-full bg-surface-container-low border-t border-border mt-auto relative z-10">
        <div class="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <span class="font-bold text-primary font-serif text-lg">National Cyber Crime Reporting Portal</span>
            <span class="text-text-secondary font-sans text-sm">
              An initiative of Government of India to facilitate victims/complainants to report cyber crime complaints online.
            </span>
          </div>
          
          <div class="flex flex-col items-center md:items-end text-center md:text-right gap-1 pt-6 md:pt-0 border-t border-border/50 md:border-0 w-full md:w-auto">
            <span class="text-text-secondary font-sans text-sm text-center">
              Created by <a href="https://adhnan.me" target="_blank" rel="noopener noreferrer" class="font-bold text-primary hover:underline">Adhnan Shereef T</a>
            </span>
            <span class="text-text-secondary/60 font-sans text-xs mt-2">
              &copy; {{ currentYear }} All Rights Reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class HomeComponent {
  protected currentYear = new Date().getFullYear();
}
