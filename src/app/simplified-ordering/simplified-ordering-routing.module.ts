import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimplifiedOrderingNewComponent } from './pages/simplified-ordering-new/simplified-ordering-new.component';

const routes: Routes = [
  {
    path: 'simple/order',
    component: SimplifiedOrderingNewComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimplifiedOrderingRoutingModule { }
