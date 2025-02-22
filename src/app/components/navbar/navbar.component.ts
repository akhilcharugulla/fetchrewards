// navbar.component.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FavouritesService } from '../../services/favourites.service';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DogService } from '../../services/dog.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule, 
    CommonModule, 
    FormsModule,
    AutoCompleteModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @Output() matchClick = new EventEmitter<void>();
  @Output() searchBreed = new EventEmitter<string>();

  searchQuery: string = '';
  filteredBreeds: string[] = [];
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private favouritesService: FavouritesService,
    private dogService: DogService
  ) {}

  ngOnInit() {
  }

  get hasMatches(): boolean {
    return this.favouritesService.getFavorites().length > 0;
  }

  filterBreeds(event: any) {
    this.dogService.getBreeds().subscribe(breeds => {
      const query = event.query.toLowerCase();
      this.filteredBreeds = breeds.filter(breed => 
        breed.toLowerCase().includes(query)
      );
    });
  }

  onSearch(event: any) {
    if (event && event.value) {
      this.searchBreed.emit(event.value);
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchBreed.emit('');
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
  navigate(path: string) {
    this.router.navigate([path]);
  }
}