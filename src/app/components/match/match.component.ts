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
  template: `
    <div class="match-container">
      <div class="match-content" *ngIf="matchedDog">
        <h2 class="match-title">Your Perfect Match!</h2>
        <p-galleria 
          [value]="[matchedDog]" 
          [showThumbnails]="false" 
          [showIndicators]="false"
          [containerStyle]="{ 'max-width': '640px' }">
          <ng-template pTemplate="item" let-dog>
            <div class="match-card">
              <p-card>
                <div class="match-details">
                  <img [src]="dog.img" [alt]="dog.name" class="match-image"/>
                  <div class="match-info">
                    <h3>{{dog.name}}</h3>
                    <p><strong>Breed:</strong> {{dog.breed}}</p>
                    <p><strong>Age:</strong> {{dog.age}} years</p>
                    <p><strong>Location:</strong> {{dog.zip_code}}</p>
                  </div>
                </div>
              </p-card>
            </div>
          </ng-template>
        </p-galleria>
      </div>
      <div class="no-match" *ngIf="!matchedDog">
        <h3>No match found yet!</h3>
        <p>Add some dogs to your favorites to find your perfect match.</p>
      </div>
    </div>
  `,
  styles: [`
    .match-container {
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 70px);
      background-color: #f8f9fa;
    }
    .match-content {
      width: 100%;
      max-width: 640px;
    }
    .match-title {
      text-align: center;
      margin-bottom: 2rem;
      color: #2196F3;
    }
    .match-card {
      padding: 1rem;
    }
    .match-details {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .match-image {
      width: 100%;
      max-width: 400px;
      height: auto;
      border-radius: 8px;
    }
    .match-info {
      text-align: center;
    }
    .no-match {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
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