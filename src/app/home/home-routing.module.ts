import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ForbiddenComponent } from '../core/pages/forbidden/forbidden.component';


const routes: Routes = [

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
