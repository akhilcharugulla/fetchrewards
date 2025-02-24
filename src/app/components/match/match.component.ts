import { Component, Input, OnInit } from '@angular/core';
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
export class MatchComponent implements OnInit {
  @Input() dogLocations: Map<string, Location> = new Map();
  @Input() showMatchDialog!: boolean;
  @Input() matchedDog: Dog | null = null;

  constructor() {}

  ngOnInit() {
  }
  
  closeMatchDialog() {
    this.showMatchDialog = false;
  }

}