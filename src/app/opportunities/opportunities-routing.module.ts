import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpportunitiesComponent } from './pages/opportunities/opportunities.component';
import { AddOpportunitiesComponent } from './pages/add-opportunities/add-opportunities.component';
import { EditOpportunitiesComponent } from './pages/edit-opportunities/edit-opportunities.component';
import { AuthGuard } from '../auth/guards/auth.guard';


const routes: Routes = [
  {path:'opportunities',component:OpportunitiesComponent,canActivate: [AuthGuard],},
  {path:'opportunities/new',component:AddOpportunitiesComponent,canActivate: [AuthGuard],},
  {path:'opportunities/edit/:id',component:EditOpportunitiesComponent,canActivate: [AuthGuard],},
  {path:'opportunities/:account/:id',component:AddOpportunitiesComponent,canActivate: [AuthGuard],},
  {path:'opportunities/new/:id',component:AddOpportunitiesComponent,canActivate: [AuthGuard],}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpportunitiesRoutingModule { }
