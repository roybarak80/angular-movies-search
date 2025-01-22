import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { environment } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root', // Ensures the service is available globally
})
export class MovieService {
  private apiUrl = environment.apiUrl
  private apiKey = environment.apiKey // Replace with your API key
  private queryCache = new Map<string, Observable<any[]>>(); // Cache for observables

  constructor(private http: HttpClient) {}

  searchMovies(query: string): Observable<any[]> {
    if (!query) return of([]); // Return an empty array for empty queries

    // Check if query already exists in the cache
    const cachedQuery = this.queryCache.get(query);
    if (cachedQuery) {
      return cachedQuery; // Return the cached observable
    }

    // Make an API call and cache the result
    const apiCall$ = this.http
      .get<any>(`${this.apiUrl}?api_key=${this.apiKey}&query=${query}`)
      .pipe(
        map((response) => response.results), // Extract results
        catchError((error) => {
          console.error('Error fetching movies:', error);
          return of([]); // Fallback to an empty array
        }),
        shareReplay(1) // Cache the result for this query
      );

    this.queryCache.set(query, apiCall$); // Cache the observable
    return apiCall$;
  }
}
