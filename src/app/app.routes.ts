import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'calendar',
    pathMatch: 'full',
  },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar/calendar.page').then(m => m.CalendarPage)
  },
  {
    path: 'event-modal',
    loadComponent: () => import('./pages/event-modal/event-modal.page').then(m => m.EventModalPage)
  },
];
