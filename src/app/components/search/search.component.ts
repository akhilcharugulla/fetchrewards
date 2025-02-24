import { Component, OnInit } from '@angular/core';
import { Dog, DogService } from '../../services/dog.service';
import { LocationService, Location } from '../../services/location.service';
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
import { NavbarComponent } from '../navbar/navbar.component';
import { FavouritesService } from '../../services/favourites.service';
import { ChipModule } from 'primeng/chip';
import { GalleriaModule } from 'primeng/galleria';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { MatchComponent } from '../match/match.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule, 
    CardModule,
    DropdownModule,
    DataViewModule,
    ButtonModule,
    PaginatorModule,
    DialogModule,
    SliderModule,
    MultiSelectModule,
    DogCardComponent,
    NavbarComponent,
    ChipModule,
    GalleriaModule,
    TooltipModule,
    SkeletonModule,
    MatchComponent
  ],
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
  filtersHidden: boolean = false;
  locationOptions: any[] = [];
  dogLocations: Map<string, Location> = new Map();
  userLocation: GeolocationPosition | null = null;
  showGalleria: boolean = false;
  selectedDogImages: any[] = [];
  selectedDog: Dog | null = null;
  activeIndex: number = 0;
  results: any[] = [];
  locationInput = ''; 
  milesInput = 100; 
  selectedZipCode: any = [];
  selectedCities: any = [];
  zipCodes: any[] = [];
  cities: any[] = [];
  showMobileFilters: boolean = false;
  isMobileView: boolean = window.innerWidth <= 576;
  showWelcomeDialog: boolean = true;
  userName: string = '';

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 2
    }
  ];

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
    private messageService: MessageService,
    private locationService: LocationService,
    private favoritesService: FavouritesService,
    private authService: AuthService
  ) {
    // Add window resize listener
    window.addEventListener('resize', () => {
      this.isMobileView = window.innerWidth <= 576;
    });
    this.userName = this.authService.getUserName();
  }

  ngOnInit() {
    this.loadBreeds();
    this.search();
    this.searchLocations();
    this.getUserLocation();
    this.favorites = this.favoritesService.getFavorites();
  }

  toggleMobileFilters() {
    this.showMobileFilters = !this.showMobileFilters;
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

  removeBreed(breed: string) {
    this.selectedBreeds = this.selectedBreeds.filter(b => b !== breed);
    this.currentPage = 0;
    this.search();
  }

  search() {
    const params: any = {
      breeds: this.selectedBreeds,
      zipCodes: this.selectedCities ?? [],
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
      this.loadDogLocations(this.dogs);
    });
  }

  loadDogLocations(dogs: Dog[]) {
    const zipCodes = [...new Set(dogs.map(dog => dog.zip_code))];
    
    this.locationService.getLocations(zipCodes).subscribe(
      (locations) => {
        this.dogLocations.clear();
        locations.forEach(loc => this.dogLocations.set(loc.zip_code, loc));
        this.calculateDistances();
      },
      (error) => console.error('Error loading dog locations:', error)
    );
  }

  calculateDistances() {
    if (!this.userLocation) return;

    const userLat = this.userLocation.coords.latitude;
    const userLon = this.userLocation.coords.longitude;

    this.dogs = this.dogs.map(dog => {
      const location = this.dogLocations.get(dog.zip_code);
      if (location) {
        const distance = this.locationService.calculateDistance(
          userLat,
          userLon,
          location.latitude,
          location.longitude
        );
        return { ...dog, distance };
      }
      return dog;
    });
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = position;
          this.calculateDistances();
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  
  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  onThumbnailClick(index: number) {
    this.activeIndex = index;
  }

  openGalleria(dog: Dog) {
    this.selectedDog = dog;
    this.selectedDogImages = Array(5).fill({img: dog.img, name: dog.name});
    this.showGalleria = true;
    this.activeIndex = 0;
  }

  closeGalleria() {
    this.showGalleria = false;
    this.selectedDog = null;
  }

  isSelectedDogFavorite(): boolean {
    return this.selectedDog ? this.isFavorite(this.selectedDog) : false;
  }

  toggleFavoriteInGalleria() {
    if (this.selectedDog) {
      this.toggleFavorite(this.selectedDog);
    }
  }
  
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onSortChange(event: any) {
    const [field, order] = event.value.split(':');
    this.sortField = field;
    this.sortOrder = order === 'asc' ? 1 : -1;
    this.search();
  }

  toggleFavorite(dog: Dog) {
    this.favoritesService.toggleFavorite(dog);
    this.favorites = this.favoritesService.getFavorites();
  }

  isFavorite(dog: Dog): boolean {
    return this.favoritesService.isFavorite(dog);
  }

  onMatchClick() {
    this.findMatch();
  }

  findMatch() {
    const favorites = this.favoritesService.getFavorites();
    if (favorites.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Favorites',
        detail: 'Please add some dogs to your favorites first',
        life: 5000
      });
      return;
    }

    this.matchedDog = null;
    this.showMatchDialog = true;

    const favoriteIds = favorites.map(dog => dog.id);
    this.dogService.getMatch(favoriteIds).subscribe({
      next: (matchId) => {
        const matchedDog = favorites.find(dog => dog.id === matchId);
        if (matchedDog) {
          this.matchedDog = matchedDog;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Match Not Found',
            detail: 'Unable to find a match at this time',
            life: 5000
          });
          this.showMatchDialog = false;
        }
      },
      error: (error) => {
        console.error('Error finding match:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to find a match at this time',
          life: 5000
        });
        this.showMatchDialog = false;
      }
    });
  }

  onDialogClosed() {
    this.showMatchDialog = false;
  }
  
  searchLocations() {
    this.locationService.searchLocations({}).subscribe(
      (data) => {
        const uniqueLocations = new Map();
 
        data.results.forEach((value: any) => {
          uniqueLocations.set(value.city, value.zip_code);
        });
 
        this.cities = Array.from(uniqueLocations.keys()); 
        this.zipCodes = Array.from(uniqueLocations.values()); 
 
        this.locationOptions = Array.from(uniqueLocations, ([city, zip_code]) => ({
          label: city,   
          value: zip_code 
        }));
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }

  clearFilters() {
    this.selectedBreeds = [];
    this.selectedAge = null;
    this.selectedCities = [];
    this.currentPage = 0;
    this.sortField = 'breed';
    this.sortOrder = 1;
    this.search();
  }

  onSearchBreed(breed: string) {
    if (breed) {
      this.selectedBreeds = [breed];
    } else {
      this.selectedBreeds = [];
    }
    this.currentPage = 0;
    this.search();
  }

  closeWelcomeDialog() {
    this.showWelcomeDialog = false;
  }
}