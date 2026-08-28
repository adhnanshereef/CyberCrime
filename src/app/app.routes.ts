import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/language', pathMatch: 'full' },
  { path: 'language', loadComponent: () => import('./screens/language-select/language-select').then(m => m.LanguageSelectComponent) },
  { path: 'complaint-type', loadComponent: () => import('./screens/complaint-type/complaint-type').then(m => m.ComplaintTypeComponent) },
  { path: 'urgency', loadComponent: () => import('./screens/urgency/urgency').then(m => m.UrgencyComponent) },
  { path: 'login', loadComponent: () => import('./screens/login/login').then(m => m.LoginComponent) },
  { path: 'what-happened', loadComponent: () => import('./screens/what-happened/what-happened').then(m => m.WhatHappenedComponent) },
  { path: 'questions', loadComponent: () => import('./screens/dynamic-questions/dynamic-questions').then(m => m.DynamicQuestionsComponent) },
];
