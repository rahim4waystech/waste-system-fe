import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadsComponent } from './pages/leads/leads.component';
import { AddLeadsComponent } from './pages/add-leads/add-leads.component';
import { EditLeadsComponent } from './pages/edit-leads/edit-leads.component';


const routes: Routes = [
  {path:'leads',component:LeadsComponent},
  {path:'leads/new',component:AddLeadsComponent},
  {path:'leads/new/:id',component:AddLeadsComponent},
  {path:'leads/edit/:id',component:EditLeadsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
