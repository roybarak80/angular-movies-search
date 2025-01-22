import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, tap , catchError} from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';
@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss'],
})
export class MovieSearchComponent {
  searchControl = new FormControl('');
  movies$: Observable<any[]> | undefined;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movies$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      switchMap((query) => {
        if (!query) return of([]); // Return an empty array for empty queries

        this.errorMessage = null; // Clear previous errors
        this.isLoading = true;

        // Use the service to fetch or retrieve cached results
        return this.movieService.searchMovies(query).pipe(
          tap(() => (this.isLoading = false)), // Stop spinner
          catchError((error) => {
            console.error('Error in MovieSearchComponent:', error);
            this.errorMessage = 'Failed to fetch movies. Please try again.';
            this.isLoading = false;
            return of([]); // Return an empty array as a fallback
          })
        );
      })
    );
  }
}
