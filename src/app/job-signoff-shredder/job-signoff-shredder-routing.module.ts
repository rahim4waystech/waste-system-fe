import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobSignoffShredderComponent } from './pages/job-signoff-shredder/job-signoff-shredder.component';
import { JobSignoffViewComponent } from '../job-signoff/pages/job-signoff-view/job-signoff-view.component';
import { JobSignoffEditManagerComponent } from '../job-signoff/pages/job-signoff-edit-manager/job-signoff-edit-manager.component';
import { JobSignoffShredderViewComponent } from './pages/job-signoff-shredder-view/job-signoff-shredder-view.component';
import { JobSignoffShredderEditComponent } from './pages/job-signoff-shredder-edit/job-signoff-shredder-edit.component';
import { AuthGuard } from '../auth/guards/auth.guard';


const routes: Routes = [
  {
    path: 'job-signoff/shredder',
    component: JobSignoffShredderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-signoff/shredder/view/:id',
    component: JobSignoffShredderViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-signoff/shredder/edit/:id',
    component: JobSignoffShredderEditComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobSignoffShredderRoutingModule { }
