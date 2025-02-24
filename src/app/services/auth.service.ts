import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_URL = "https://frontend-take-home-service.fetch.com/auth";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userName: string = '';
  constructor(private http: HttpClient) {}
  login(name: string, email: string): Observable<any> {
    this.userName = name;
    sessionStorage.setItem('userName', name);
    return this.http.post(`${AUTH_URL}/login`, { name, email }, { withCredentials: true });
  }

  logout(): Observable<any> {
    sessionStorage.removeItem('userName');
    return this.http.post(`${AUTH_URL}/logout`, {}, { withCredentials: true });
  }

  getUserName(): string {
    if (!this.userName) {
      this.userName = sessionStorage.getItem('userName') || '';
    }
    return this.userName;
  }
}

