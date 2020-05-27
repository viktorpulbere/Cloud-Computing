import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthGuard} from "./auth.guard";
import { CreateComponent } from './create/create.component';
import { MapComponent } from './map/map.component';
import { ScanComponent } from './scan/scan.component';
import { RatingComponent } from './rating/rating.component';


const routes: Routes = [
  {
    path: 'home',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'callback',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent
  },
  {
    path: 'map',
    canActivate: [AuthGuard],
    component: MapComponent
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    component: CreateComponent
  },
  {
    path: 'scan',
    canActivate: [AuthGuard],
    component: ScanComponent
  },
  {
    path: 'rating',
    canActivate: [AuthGuard],
    component: RatingComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
