import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './pages/contact/contact.component';
import { ContactNewComponent } from './pages/contact-new/contact-new.component';
import { ContactEditComponent } from './pages/contact-edit/contact-edit.component';
import { AuthGuard } from '../auth/guards/auth.guard';


const routes: Routes = [
  {
    path: 'contacts',
    component: ContactComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'contacts/new',
    component: ContactNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'contacts/new/:id',
    component: ContactNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'contacts/edit/:id',
    component: ContactEditComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
