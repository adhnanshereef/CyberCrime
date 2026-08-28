import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CONTACTS, ContactInfo } from '../../core/data/contacts';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-background text-on-background flex flex-col font-primary pb-32">
      <main class="flex-grow flex flex-col items-center w-full px-6 pt-12 mx-auto max-w-5xl">
        
        <header class="text-center mb-10 w-full animate-fade-in">
          <div class="w-16 h-16 bg-surface-container-highest text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8 8 0 0 1-8.5 8 8.6 8.6 0 0 1-4-.9L3 20l1.4-4.5A8 8 0 1 1 21 11.5Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></svg>
          </div>
          <h1 class="text-3xl md:text-5xl font-bold text-primary mb-4 font-serif">
            Contact Directory
          </h1>
          <p class="text-lg md:text-xl text-text-secondary font-sans max-w-2xl mx-auto">
            Find the Nodal Cyber Cell Officers and Grievance Officers for your State or Union Territory.
          </p>
        </header>

        <!-- Search Bar -->
        <div class="w-full max-w-2xl mb-12 animate-fade-in" style="animation-delay: 0.1s; animation-fill-mode: both;">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" class="text-text-secondary"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input 
              type="text" 
              [ngModel]="searchQuery()" 
              (ngModelChange)="searchQuery.set($event)"
              class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-border bg-surface text-on-surface font-sans text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm placeholder:text-text-secondary/50" 
              placeholder="Search by state, name, email, or phone..." 
            />
          </div>
        </div>

        <!-- Contact Grid -->
        <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style="animation-delay: 0.2s; animation-fill-mode: both;">
          @for (contact of filteredContacts(); track contact.state) {
            <div class="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              
              <!-- State Header -->
              <div class="bg-surface-container-low px-6 py-4 border-b border-border">
                <h2 class="text-xl font-bold text-primary">{{ contact.state }}</h2>
              </div>
              
              <div class="p-6 flex flex-col gap-6">
                
                <!-- Nodal Officer -->
                <div class="flex flex-col gap-3">
                  <h3 class="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Nodal Cyber Cell Officer
                  </h3>
                  <div class="flex flex-col gap-1 pl-6 border-l-2 border-surface-container-highest">
                    <span class="font-bold text-on-surface text-lg">{{ contact.nodalOfficer.name }}</span>
                    <span class="text-sm text-text-primary">{{ contact.nodalOfficer.rank }}</span>
                    @if (contact.nodalOfficer.email && contact.nodalOfficer.email !== 'N/A') {
                      <a [href]="'mailto:' + contact.nodalOfficer.email" class="text-urgent hover:underline text-sm font-medium mt-1 inline-flex items-center gap-1">
                        <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        {{ contact.nodalOfficer.email }}
                      </a>
                    }
                  </div>
                </div>

                <hr class="border-border" />

                <!-- Grievance Officer -->
                <div class="flex flex-col gap-3">
                  <h3 class="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Grievance Officer
                  </h3>
                  <div class="flex flex-col gap-1 pl-6 border-l-2 border-surface-container-highest">
                    <span class="font-bold text-on-surface text-lg">{{ contact.grievanceOfficer.name }}</span>
                    <span class="text-sm text-text-primary">{{ contact.grievanceOfficer.rank }}</span>
                    
                    @if (contact.grievanceOfficer.contact && contact.grievanceOfficer.contact !== 'N/A') {
                      <a [href]="'tel:' + contact.grievanceOfficer.contact" class="text-primary hover:underline text-sm font-medium mt-1 inline-flex items-center gap-1">
                        <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        {{ contact.grievanceOfficer.contact }}
                      </a>
                    }
                    @if (contact.grievanceOfficer.email && contact.grievanceOfficer.email !== 'N/A') {
                      <a [href]="'mailto:' + contact.grievanceOfficer.email" class="text-urgent hover:underline text-sm font-medium inline-flex items-center gap-1">
                        <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        {{ contact.grievanceOfficer.email }}
                      </a>
                    }
                  </div>
                </div>

              </div>
            </div>
          } @empty {
            <div class="col-span-full text-center bg-surface-container-low border border-border p-8 rounded-3xl mt-4">
              <svg aria-hidden="true" class="mx-auto mb-4 text-text-secondary opacity-50" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <h3 class="text-xl font-bold text-primary mb-2">No results found</h3>
              <p class="text-text-secondary font-sans">Try adjusting your search criteria.</p>
            </div>
          }
        </div>

      </main>
    </div>
  `
})
export class ContactComponent {
  protected contacts = CONTACTS;
  protected searchQuery = signal('');

  protected filteredContacts = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.contacts;
    
    return this.contacts.filter(c => {
      return c.state.toLowerCase().includes(q) ||
        c.nodalOfficer.name.toLowerCase().includes(q) ||
        c.nodalOfficer.email.toLowerCase().includes(q) ||
        c.nodalOfficer.rank.toLowerCase().includes(q) ||
        c.grievanceOfficer.name.toLowerCase().includes(q) ||
        c.grievanceOfficer.email.toLowerCase().includes(q) ||
        c.grievanceOfficer.contact.toLowerCase().includes(q);
    });
  });
}
