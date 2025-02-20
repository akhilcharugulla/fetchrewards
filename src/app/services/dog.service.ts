import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
  distance?: number;
}

export interface SearchResponse {
  resultIds: string[];
  total: number;
  next: string;
  prev: string;
}

const API_URL = 'https://frontend-take-home-service.fetch.com';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  constructor(private http: HttpClient) {}

  getBreeds(): Observable<string[]> {
    return this.http.get<string[]>(`${API_URL}/dogs/breeds`, { withCredentials: true });
  }

  searchDogs(params: any): Observable<{ dogs: Dog[], total: number, next: string, prev: string }> {
    return this.http.get<SearchResponse>(`${API_URL}/dogs/search`, {
      params,
      withCredentials: true
    }).pipe(
      switchMap(response => {
        return this.getDogsByIds(response.resultIds).pipe(
          map(dogs => ({
            dogs,
            total: response.total,
            next: response.next,
            prev: response.prev
          }))
        );
      })
    );
  }

  getDogsByIds(dogIds: string[]): Observable<Dog[]> {
    return this.http.post<Dog[]>(`${API_URL}/dogs`, dogIds, { withCredentials: true });
  }

  getMatch(favoriteIds: string[]): Observable<string> {
    return this.http.post<{ match: string }>(`${API_URL}/dogs/match`, favoriteIds, { withCredentials: true })
      .pipe(map(response => response.match));
  }
}