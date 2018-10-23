import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { PlanetService } from '../planet.service';
import { IPlanet } from '../planet';

@Component({
  selector: 'app-planet-details',
  templateUrl: './planet-details.component.html',
  styleUrls: ['./planet-details.component.css']
})
export class PlanetDetailsComponent implements OnInit {
  planetId: string;
  planet:IPlanet = {"name": "Loading...",
            "rotation_period": "unknown",
            "orbital_period": "unknown",
            "diameter": "unknown",
            "climate": "",
            "gravity": "",
            "terrain": "",
            "surface_water": "unknown",
            "population": "unknown",
            "residents": [],
            "films": [],
            "url": "https://swapi.co/api/planets/2/"}
  climates: Array<string>;
  terrains: Array<string>;
  films: Array<string>=[];

  constructor(private _planetService:PlanetService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.planetId = id;
      const planet = this._planetService.getPlanet(id);
      if(planet){
        this.setVariables(planet)
      }
      else{
        this._planetService.getPlanetAsync(id)
                    .subscribe(planet => this.setVariables(planet),
                    error => () => {
                      alert(error.message);
                      this.goBack();
                    });
      }
    });
  }
  goBack(){
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  setVariables(planet){
    this.planet = planet;
    this.climates = planet.climate.split(',').map(x=>x.trim());
    this.terrains = planet.terrain.split(',').map(x=>x.trim());
    this.films = this._planetService.getFilms(this.planet.films);
  }

}
