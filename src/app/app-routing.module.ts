import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanetListComponent } from './planet-list/planet-list.component';
import { PlanetDetailsComponent } from './planet-details/planet-details.component';
import { NotFoundComponent } from './not-found/not-found.component';



const routes: Routes = [
  { path: '', redirectTo: '/planets', pathMatch: 'full' },
  {path:'planets', component: PlanetListComponent},
  {path:'planets/:id', component: PlanetDetailsComponent},
  { path: '**',   component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [];
