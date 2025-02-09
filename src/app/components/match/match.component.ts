import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DogCardComponent } from '../dog-card/dog-card.component';

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [FormsModule,CommonModule,DialogModule,DogCardComponent],
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent {
  matchedDog: any = null;
}
