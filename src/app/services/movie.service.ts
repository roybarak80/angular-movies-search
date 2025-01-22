import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { environment } from '../enviroments/enviroment';
import { ErrorDialogComponent } from '../components/movie-search/dialog/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root', // Ensures the service is available globally
})
export class MovieService {
  private apiUrl = environment.apiUrl
  private apiKey = environment.apiKey // Replace with your API key
  private apiAuth = environment.authorization;
  private queryCache = new Map<string, Observable<any[]>>(); // Cache for observables

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  searchMovies(query: string): Observable<any[]> {
    if (!query) return of([]); // Return an empty array for empty queries

    // Check if query already exists in the cache
    const cachedQuery = this.queryCache.get(query);
    if (cachedQuery) {
      return cachedQuery; // Return the cached observable
    }

    const headers = new HttpHeaders({
      accept: 'application/json',
      Authorization: `${this.apiAuth}`,
    });

    // Make an API call and cache the result

    const apiCall$ = this.http
      .get<any>(`${this.apiUrl}/search/movie?api_key=${this.apiKey}?&query=${query}`, {
        headers,
        observe: 'response', // Observe the full response to handle status codes
      })
      .pipe(
        map((response) => {
          if (response.status === 204 || !response.body || !response.body.results) {
            // Treat 204 or empty body as an error-like case
            throw new Error('No results found.');
          }
          return response.body.results; // Correctly access the results
        }), // Extract results
        catchError((error) => {
          this.handleError(error); // Trigger the dialog
          return of([]); // Fallback to an empty array
        }),
        shareReplay(1) // Cache the result for this query
      );

    this.queryCache.set(query, apiCall$); // Cache the observable
    return apiCall$;
  }
  private handleError(error: any): void {
    let errorMessage = 'Failed to fetch movies. Please try again.';
    if (error.message === 'No results found.') {
      errorMessage = 'No movies found for your search query.';
    } else if (error.name === 'TimeoutError') {
      errorMessage = 'The request timed out. Please check your network and try again.';
    } else if (!navigator.onLine) {
      errorMessage = 'No internet connection. Please reconnect and try again.';
    }

    // Open the error dialog
    this.dialog.open(ErrorDialogComponent, {
      data: { message: errorMessage },
    });
  }
}
