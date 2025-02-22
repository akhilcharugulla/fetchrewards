import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Dog } from './dog.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  private favoritesSubject = new BehaviorSubject<Dog[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private messageService: MessageService) {}

  getFavorites(): Dog[] {
    return this.favoritesSubject.value;
  }

  toggleFavorite(dog: Dog) {
    const currentFavorites = this.favoritesSubject.value;
    const index = currentFavorites.findIndex(f => f.id === dog.id);

    if (index === -1) {
      this.favoritesSubject.next([...currentFavorites, dog]);
      this.messageService.add({
        severity: 'success',
        summary: 'Added to Favorites',
        detail: `${dog.name} has been added to your favorites`
      });
    } else {
      const updatedFavorites = currentFavorites.filter(f => f.id !== dog.id);
      this.favoritesSubject.next(updatedFavorites);
      this.messageService.add({
        severity: 'info',
        summary: 'Removed from Favorites',
        detail: `${dog.name} has been removed from your favorites`
      });
    }
  }

  isFavorite(dog: Dog): boolean {
    return this.favoritesSubject.value.some(f => f.id === dog.id);

  }
}
