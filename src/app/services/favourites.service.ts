import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Dog } from './dog.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  private readonly FAVOURITE_DOGS_KEY = 'favorite_dogs';
  private favoritesSubject = new BehaviorSubject<Dog[]>(this.loadFavoritesFromStorage());
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private messageService: MessageService) {
    this.favoritesSubject.next(this.loadFavoritesFromStorage());
  }

  private loadFavoritesFromStorage(): Dog[] {
    const storedFavorites = sessionStorage.getItem(this.FAVOURITE_DOGS_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  private saveFavoritesToStorage(favorites: Dog[]) {
    sessionStorage.setItem(this.FAVOURITE_DOGS_KEY, JSON.stringify(favorites));
  }

  getFavorites(): Dog[] {
    return this.favoritesSubject.value;
  }

  toggleFavorite(dog: Dog) {
    const currentFavorites = this.favoritesSubject.value;
    const index = currentFavorites.findIndex(f => f.id === dog.id);

    let updatedFavorites: Dog[];
    if (index === -1) {
      updatedFavorites = [...currentFavorites, dog];
      this.messageService.add({
        severity: 'success',
        summary: 'Added to Favorites',
        detail: `<b>${dog.name}</b> has been added to your favorites`,
        life: 5000
      });
    } else {
      updatedFavorites = currentFavorites.filter(f => f.id !== dog.id);
      this.messageService.add({
        severity: 'info',
        summary: 'Removed from Favorites',
        detail: `<b>${dog.name}</b> has been removed from your favorites`,
        life: 5000,
      });
    }

    this.favoritesSubject.next(updatedFavorites);
    this.saveFavoritesToStorage(updatedFavorites);
  }

  isFavorite(dog: Dog): boolean {
    return this.favoritesSubject.value.some(f => f.id === dog.id);
  }

  clearFavorites() {
    this.favoritesSubject.next([]);
    sessionStorage.removeItem(this.FAVOURITE_DOGS_KEY);
  }
}