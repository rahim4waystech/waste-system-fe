import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComplianceComponent } from './pages/compliance/compliance.component';

const routes: Routes = [
  {path:'compliance',component:ComplianceComponent},
  {path:'compliance/:id',component:ComplianceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplianceRoutingModule { }
