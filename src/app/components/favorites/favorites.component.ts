import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DogCardComponent } from '../dog-card/dog-card.component';
import { DogService } from '../../services/dog.service';
import { MessageService } from 'primeng/api';
import { Dog } from '../../services/dog.service';
import { FavouritesService } from '../../services/favourites.service';
import { Router } from '@angular/router';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    DogCardComponent,
    ChipModule
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favoriteDogs: Dog[] = [];
  showMatchDialog: boolean = false;
  matchedDog: Dog | null = null;
  showEmptyState: boolean = false;

  constructor(
    private favoritesService: FavouritesService,
    private dogService: DogService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favoriteDogs = this.favoritesService.getFavorites();
    this.showEmptyState = this.favoriteDogs.length === 0;
  }

  toggleFavorite(dog: Dog) {
    this.favoritesService.toggleFavorite(dog);
    this.loadFavorites();
  }

  findMatch() {
    if (this.favoriteDogs.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Favorites',
        detail: 'Please add some dogs to your favorites first',
        life: 5000
      });
      return;
    }

    const favoriteIds = this.favoriteDogs.map(dog => dog.id);
    this.dogService.getMatch(favoriteIds).subscribe(matchId => {
      const matchedDog = this.favoriteDogs.find(dog => dog.id === matchId);
      if (matchedDog) {
        this.matchedDog = matchedDog;
        this.showMatchDialog = true;
      }
    });
  }

  goBack() {
    this.router.navigate(['/search']);
  }

  goToSearch() {
    this.router.navigate(['/search']);
  }
}