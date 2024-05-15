import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubcontractorComponent } from './pages/subcontractor/subcontractor.component';
import { SubcontractorNewComponent } from './pages/subcontractor-new/subcontractor-new.component';
import { SubcontractorEditComponent } from './pages/subcontractor-edit/subcontractor-edit.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SubcontractorDepotAddComponent } from './pages/subcontractor-depot-add/subcontractor-depot-add.component';
import { SubcontractorDepotEditComponent } from './pages/subcontractor-depot-edit/subcontractor-depot-edit.component';


const routes: Routes = [
  {
    path: 'subcontractors',
    component: SubcontractorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'subcontractors/new',
    component: SubcontractorNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'subcontractors/edit/:id',
    component: SubcontractorEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'subcontractors/depot/new/:id',
    component: SubcontractorDepotAddComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'subcontractors/depot/edit/:id',
    component: SubcontractorDepotEditComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubcontractorRoutingModule { }
