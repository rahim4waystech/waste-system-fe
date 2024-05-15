import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BatchComponent } from './pages/batch/batch.component';


const routes: Routes = [
  {
    path: 'export',
    component: BatchComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchRoutingModule { }
