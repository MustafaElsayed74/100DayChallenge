import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ChallengeListComponent } from './features/dashboard/challenge-list/challenge-list.component';
import { ChallengeDetailComponent } from './features/challenge/challenge-detail/challenge-detail.component';
import { ChallengeCreateComponent } from './features/challenge/challenge-create/challenge-create.component';
import { ChallengeEditComponent } from './features/challenge/challenge-edit/challenge-edit.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'friends',
        loadComponent: () => import('./features/friends/friends.component').then(m => m.FriendsComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'dashboard',
        component: ChallengeListComponent,
        canActivate: [AuthGuard]
    },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    {
        path: 'challenge/:id',
        component: ChallengeDetailComponent,
        canActivate: [AuthGuard]
    },
    { path: 'challenges/create', component: ChallengeCreateComponent, canActivate: [AuthGuard] },
    { path: 'challenges/edit/:id', component: ChallengeEditComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard' }
];
