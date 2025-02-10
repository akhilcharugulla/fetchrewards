import { Component, OnInit } from '@angular/core';
import { Dog, DogService } from '../../services/dog.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DogCardComponent } from '../dog-card/dog-card.component';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule,CommonModule, CardModule,DropdownModule,DataViewModule,ButtonModule,PaginatorModule,DialogModule,SliderModule,MultiSelectModule,
    DogCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})


export class SearchComponent implements OnInit {
  dogIds: any[] = [];
  breeds: string[] = [];
  selectedBreeds: string[] = [];
  selectedAge: any = null;
  dogs: Dog[] = [];
  totalDogs: number = 0;
  favorites: Dog[] = [];
  sortField: string = 'breed';
  sortOrder: number = 1;
  showMatchDialog: boolean = false;
  matchedDog: Dog | null = null;
  currentPage: number = 0;
  showFilters: boolean = true;
  filtersHidden: boolean = true; 

  ageOptions = [
    { label: 'Select Age', value: null },
    { label: 'Puppy (0-1 year)', value: { min: 0, max: 1 } },
    { label: 'Young (1-3 years)', value: { min: 1, max: 3 } },
    { label: 'Adult (3-8 years)', value: { min: 3, max: 8 } },
    { label: 'Senior (8+ years)', value: { min: 8, max: 20 } }
  ];

  sortOptions = [
    { label: 'Breed (A-Z)', value: 'breed:asc' },
    { label: 'Breed (Z-A)', value: 'breed:desc' },
    { label: 'Name (A-Z)', value: 'name:asc' },
    { label: 'Name (Z-A)', value: 'name:desc' },
    { label: 'Age (Youngest)', value: 'age:asc' },
    { label: 'Age (Oldest)', value: 'age:desc' }
  ];

  constructor(
    private dogService: DogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadBreeds();
    this.search();
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.search();
  }
  
  loadBreeds() {
    this.dogService.getBreeds().subscribe(breeds => {
      this.breeds = breeds;
    });
  }

  search() {
    const params: any = {
      breeds: this.selectedBreeds,
      sort: `${this.sortField}:${this.sortOrder === 1 ? 'asc' : 'desc'}`,
      size: 12,
      from: this.currentPage * 12
    };

    if (this.selectedAge) {
      params.ageMin = this.selectedAge.min;
      params.ageMax = this.selectedAge.max;
    }

    this.dogService.searchDogs(params).subscribe(response => {
      this.dogs = response.dogs;
      this.totalDogs = response.total;
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
    this.filtersHidden = !this.filtersHidden;
  }

  onSortChange(event: any) {
    const [field, order] = event.value.split(':');
    this.sortField = field;
    this.sortOrder = order === 'asc' ? 1 : -1;
    this.search();
  }

  toggleFavorite(dog: Dog) {
    const index = this.favorites.findIndex(f => f.id === dog.id);
    if (index === -1) {
      this.favorites.push(dog);
      this.messageService.add({
        severity: 'success',
        summary: 'Added to Favorites',
        detail: `${dog.name} has been added to your favorites`
      });
    } else {
      this.favorites.splice(index, 1);
      this.messageService.add({
        severity: 'info',
        summary: 'Removed from Favorites',
        detail: `${dog.name} has been removed from your favorites`
      });
    }
  }

  isFavorite(dog: Dog): boolean {
    return this.favorites.some(f => f.id === dog.id);
  }

  findMatch() {
    if (this.favorites.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Favorites',
        detail: 'Please add some dogs to your favorites first'
      });
      return;
    }

    const favoriteIds = this.favorites.map(dog => dog.id);
    this.dogService.getMatch(favoriteIds).subscribe(matchId => {
      const matchedDog = this.favorites.find(dog => dog.id === matchId);
      if (matchedDog) {
        this.matchedDog = matchedDog;
        this.showMatchDialog = true;
      }
    });
  }
}