import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  name = '';
  email = '';
  nameError: string = '';
  emailError: string = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onInputFocus(event: FocusEvent) {
    const parent = (event.target as HTMLElement).closest('.input-group');
    if (parent) {
      parent.classList.add('focused');
    }
  }

  onInputBlur(event: FocusEvent) {
    const parent = (event.target as HTMLElement).closest('.input-group');
    if (parent) {
      parent.classList.remove('focused');
    }
  }

  login() {
    this.nameError = '';
    this.emailError = '';

    // Validate name field
    if (!this.name.trim()) {
      this.nameError = 'Name is required.';
    }

    // Validate email field
    if (!this.email.trim()) {
      this.emailError = 'Email is required.';
    }

    // If there are errors, do not proceed with login
    if (this.nameError || this.emailError) {
      return;
    }
    
    this.isLoading = true;

    this.authService.login(this.name, this.email).subscribe({
      next: (resp) => {
        console.log('Login successful');
        this.router.navigate(['/search']);
      },
      error: (err) => {
        // routing again to search page beacuse /login api of fetch rewards in backend , is returning us error response
        sessionStorage.setItem('showWelcomeDialog', 'true');
        if(err.status== "200"){
          this.router.navigate(['/search']);
        }else{
          this.emailError = "Enter valid Email";
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}