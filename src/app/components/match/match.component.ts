import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { Dog } from '../../services/dog.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { Location } from '../../services/location.service';
import { DogCardComponent } from '../dog-card/dog-card.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [CommonModule, GalleriaModule, CardModule, ButtonModule, 
    SkeletonModule, DogCardComponent, DialogModule
  ],
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent{
  @Input() dogLocations: Map<string, Location> = new Map();
  @Input() matchedDog: Dog | null = null;
  @Input() showMatchDialog: boolean;
  hideLoveSymbol: boolean
  @Output() dialogClosed = new EventEmitter<void>();

  constructor() {
    this.showMatchDialog = false;
    this.hideLoveSymbol = true;
  }
  
  closeMatchDialog() {
    this.showMatchDialog = false;
    this.dialogClosed.emit();
  }

}