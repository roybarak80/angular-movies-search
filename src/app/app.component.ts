import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MoviesService } from './movies.service';
import { MovieSearchComponent } from "./components/movie-search/movie-search.component";
  

@Component({
  selector: 'app-root',
  imports: [MovieSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  constructor(private movies: MoviesService){

  }
  title = 'movies-app';


  ngOnInit(): void {


  

}
}
