import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  name = '';
  email = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.name, this.email).subscribe((resp) => {
      console.log('Login successful');
      this.router.navigate(['/search']);

    },
    (err)=>{
      console.log(err)
      this.router.navigate(['/search']);
    });
  }
}
