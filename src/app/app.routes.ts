import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home', loadComponent: () => import('../app/features/home/home.component').then((file) => file.HomeComponent),
    },
    {
        path: 'dashboard', loadComponent: () => import('../app/features/dashboard/dashboard.component').then((file) => file.DashboardComponent),
    },
    {
        path: '**',
        redirectTo: 'home',
    }
];
