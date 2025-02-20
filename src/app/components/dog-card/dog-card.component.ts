import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Dog } from '../../services/dog.service';
import { Location } from '../../services/location.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dog-card',
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule],
  templateUrl: './dog-card.component.html',
  styleUrl: './dog-card.component.css'
})
export class DogCardComponent {
  @Input() dog!: Dog;
  @Input() isFavorite: boolean = false;
  @Input() distance?: number;
  @Input() location?: Location;
  @Output() favoriteToggle = new EventEmitter<Dog>();

  onFavoriteClick() {
    this.favoriteToggle.emit(this.dog);
  }
}