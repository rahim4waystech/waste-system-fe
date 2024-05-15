import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipTicketDeleteComponent } from './pages/tip-ticket-delete/tip-ticket-delete.component';
import { TipTicketEditComponent } from './pages/tip-ticket-edit/tip-ticket-edit.component';
import { TipTicketNewComponent } from './pages/tip-ticket-new/tip-ticket-new.component';
import { TipTicketsComponent } from './pages/tip-tickets/tip-tickets.component';

const routes: Routes = [
  {
    path: 'tip-ticket',
    component: TipTicketsComponent,
  },
  {
    path: 'tip-ticket/new',
    component: TipTicketNewComponent,
  },
  {
    path: 'tip-ticket/edit/:id',
    component: TipTicketEditComponent,
  },
  {
    path: 'tip-ticket/delete/:id',
    component: TipTicketDeleteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipTicketRoutingModule { }
