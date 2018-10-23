import { Component, OnInit } from '@angular/core';
import { PlanetService } from '../planet.service';
import { IPlanet } from '../planet';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-planet-list',
  templateUrl: './planet-list.component.html',
  styleUrls: ['./planet-list.component.css']
})
export class PlanetListComponent implements OnInit {
  planets:IPlanet[]=[];
  page = {
    length:80,
    pageSize:10,
    pageIndex:0
  }
  isSearch:boolean = false;
  loading:boolean = true;
  searchTerm:string;

  constructor(private _planetService:PlanetService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {

    this.getPlanets();
    if(this.planets.length==0)
        var req = this._planetService.getMorePlanets(0, this.page.pageSize);
        if(req) {
          req.subscribe(this.getPlanets.bind(this),
                        error => alert(error.message));
        }

  }

  pageEvent(event){
    this.page = event;
    this.subscribe();
  }
  subscribe(){
    this.planets = [];
    const { pageIndex, pageSize, length } = this.page;
    const startIndex = pageIndex * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    const req = this._planetService.getMorePlanets(startIndex, endIndex);
    if(req){
      req.subscribe(this.getPlanets.bind(this),
                    error => alert(error.message));
      this.loading = true;
    }else{
      this.getPlanets();
    }
  }

  getPlanets(){
    this.loading = false;
    const { pageIndex, pageSize, length } = this.page;
    const startIndex = pageIndex * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    this.planets = this._planetService.getPlanets(startIndex, endIndex);
    this.page.length = this._planetService.planetsCount || 61;
    if(endIndex-startIndex!=this.planets.length) this.subscribe();
  }

  onSelect(planet){
    const id = planet.url.match(/\/(\d+)\//)[1];
    this.router.navigate([id], { relativeTo: this.route });
  }

  search(){
    this.loading = true;
    this.isSearch = true;
    this.planets = this._planetService.searchForPlanets(this.searchTerm);
    const req  = this._planetService.searchForPlanetsAsync(this.searchTerm);
    if(req){
      req.subscribe(planets =>{
        if(!this.isSearch)return;
        this.planets = planets.results;
        this.loading = false;
      },
      error => alert(error.message));
    }else{
      this.loading = false;
    }
  }
  searchReset(){
    this.isSearch = false;
    this.searchTerm = '';
    this.getPlanets();
  }
}
