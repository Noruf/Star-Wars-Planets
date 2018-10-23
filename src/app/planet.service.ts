import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable} from '../../node_modules/rxjs';
import { PlanetsResponse } from './planets-response';
import { IPlanet } from './planet';
import { FilmsResponse } from './films-response';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {

  private api:string = 'https://swapi.co/api/planets/';
  private next:string = 'https://swapi.co/api/planets/';
  private filmsApi:string = 'https://swapi.co/api/films/'
  request: Observable<PlanetsResponse>;
  planets: IPlanet[] = [];
  planetsRequested:number = 0;
  planetsCount:number;
  planetsOngoingRequest = false;
  films={};

  constructor(private http:HttpClient) {
    if(localStorage.planets&&localStorage.planetsCount&&localStorage.next&&localStorage.films){
      this.planets = JSON.parse(localStorage.planets);
      this.planetsCount = localStorage.planetsCount;
      this.next = localStorage.next;
      this.films = JSON.parse(localStorage.films);
    }
    else{
      this.getMorePlanets(0,10);
      this.http.get<FilmsResponse>(this.filmsApi).subscribe(data=>{
        this.films = data.results.reduce((acc,film)=>{
          acc[film.url] = `Episode ${film.episode_id}: ${film.title}`;
          return acc;
        },{});
        localStorage.films = JSON.stringify(this.films);
      })
    }
  }

  needMorePlanets(){
    return !this.planetsOngoingRequest &&
          this.planets.length < this.planetsRequested &&
          (!this.planetsCount || this.planets.length < this.planetsCount);
  }

  getMorePlanets(startIndex, endIndex):Observable<PlanetsResponse>{
    this.planetsRequested = endIndex;
    if(!this.needMorePlanets()|| this.next==null){
      this.request = this.planetsOngoingRequest? this.request: null;
      return this.request;
    }
    this.planetsOngoingRequest = true;
    this.request = this.http.get<PlanetsResponse>(this.next);
    this.request.subscribe(this.gotPlanets.bind(this));
    return this.request;
  }

  gotPlanets(data:PlanetsResponse){
    this.planets = [...this.planets, ...data.results];
    localStorage.planetsCount = this.planetsCount = data.count;
    localStorage.next = this.next = data.next||null;
    localStorage.planets = JSON.stringify(this.planets);
    this.planetsOngoingRequest = false;
    this.getMorePlanets(0, this.planetsRequested);
  }

  getPlanets(startIndex, endIndex){
   return this.planets.slice(startIndex, endIndex);
  }

  getPlanet(id){
    const url = `https://swapi.co/api/planets/${id}/`;
    const planet = this.planets.find(x => x.url === url);
    return planet;
  }
  getPlanetAsync(id){
    const url = `https://swapi.co/api/planets/${id}/`;
    return this.http.get<IPlanet>(url);
  }
  searchForPlanets(term){
    const planets = this.planets.filter(x => (new RegExp(term,"i").test(x.name)));
    return planets;
  }
  searchForPlanetsAsync(term){
    if(this.planets.length==this.planetsCount) return null;
    return this.http.get<PlanetsResponse>(`${this.api}?search=${term}`);
  }
  getFilms(films){
    return films.map(x => {
      return this.films.hasOwnProperty(x)?this.films[x]:'Episode '+x.match(/\/(\d+)\//)[1];
    });

  }

}
