import { IPlanet } from "./planet";

export interface PlanetsResponse {
  count?: number;
  next?: string;
  previous?: string;
  results?:Array<IPlanet>;
}
