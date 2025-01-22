import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './enviroments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) { }

  getPopularMovies(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/movie/popular?api_key=${environment.apiKey}`)
  }

  getMovieByName(name: string): Observable<any>{
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: environment.authorization
      }
    };
    

    return this.http.get(`https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=1`, options)

  }
}
