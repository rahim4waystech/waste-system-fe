import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YardTradeSignoffComponent } from './pages/yard-trade-signoff/yard-trade-signoff.component';

const routes: Routes = [
  {
    path: 'yard-trade-signoff',
    component: YardTradeSignoffComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YardTradeSignoffRoutingModule { }
