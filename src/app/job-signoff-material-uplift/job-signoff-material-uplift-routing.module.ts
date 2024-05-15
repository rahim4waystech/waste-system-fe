import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobSignoffMaterialUpliftComponent } from './pages/job-signoff-material-uplift/job-signoff-material-uplift.component';
import { MateralUpliftAddComponent } from './pages/materal-uplift-add/materal-uplift-add.component';
import { MaterialUpliftEditComponent } from './pages/material-uplift-edit/material-uplift-edit.component';

const routes: Routes = [
  {
    path: 'job-signoff/material-uplift',
    component: JobSignoffMaterialUpliftComponent,
  },
  {
    path: 'job-signoff/material-uplift/new',
    component: MateralUpliftAddComponent,
  },
  {
    path: 'job-signoff/material-uplift/edit/:id',
    component: MaterialUpliftEditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobSignoffMaterialUpliftRoutingModule { }
