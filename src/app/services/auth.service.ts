import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_URL = "https://frontend-take-home-service.fetch.com/auth";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}
  login(name: string, email: string): Observable<any> {
    return this.http.post(`${AUTH_URL}/login`, { name, email }, { withCredentials: true });
    //return this.http.post('https://frontend-take-home-service.fetch.com/auth/login', { name, email }, { withCredentials: true });
  }
}

