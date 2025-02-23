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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule, 
    CommonModule, 
    FormsModule,
    AutoCompleteModule,
    ToastModule
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
    private dogService: DogService,
    private messageService: MessageService
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

  onMatchClick() {
    if (this.hasMatches) {
      this.matchClick.emit();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Favorites',
        detail: 'Please favorite an item to get a match.',
        life: 5000
      });
    }
  }

  getProgressBarClass(severity: string): string {
    switch (severity) {
      case 'success':
        return 'success';
      case 'warn':
        return 'warn';
      case 'error':
        return 'error';
      case 'info':
      default:
        return 'info';
    }
  }
  
  navigate(path: string) {
    this.router.navigate([path]);
  }
}