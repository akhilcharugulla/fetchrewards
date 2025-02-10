import { CommonModule } from '@angular/common';
import { Component,EventEmitter,Input, Output} from '@angular/core';
import { Dog } from '../../services/dog.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dog-card',
  standalone: true,
  imports: [CardModule,ButtonModule, CommonModule],
  templateUrl: './dog-card.component.html',
  styleUrl: './dog-card.component.css'
})
export class DogCardComponent {
  @Input() dog: any;
  @Input() isFavorite: boolean = false;
  @Output() favoriteToggle = new EventEmitter<Dog>();

  constructor(){
    console.log("dog-card")
  }
  onFavoriteClick() {
    this.favoriteToggle.emit(this.dog);
  }

}
