import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SearchComponent } from './components/search/search.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { MatchComponent } from './components/match/match.component';

export const routes: Routes = [
{ path: '', redirectTo: '/login', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'search', component: SearchComponent },
{ path: 'favorites', component: FavoritesComponent },
{ path: 'match', component: MatchComponent }
];
