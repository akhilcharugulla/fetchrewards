import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { Dog } from '../../services/dog.service';
import { FavouritesService } from '../../services/favourites.service';
import { DogService } from '../../services/dog.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [CommonModule, GalleriaModule, CardModule, ButtonModule],
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent implements OnInit {
  matchedDog: Dog | null = null;

  constructor(
    private favouritesService: FavouritesService,
    private dogService: DogService
  ) {}

  ngOnInit() {
    this.findMatch();
  }

  findMatch() {
    const favorites = this.favouritesService.getFavorites();
    if (favorites.length > 0) {
      const favoriteIds = favorites.map(dog => dog.id);
      this.dogService.getMatch(favoriteIds).subscribe(matchId => {
        this.matchedDog = favorites.find(dog => dog.id === matchId) || null;
      });
    }
  }
}