import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PodsRoutingModule } from './pods-routing.module';
import { PodsComponent } from './pages/pods/pods.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { PodsViewComponent } from './pages/pods-view/pods-view.component';
import { EmailPodsComponent } from './modals/email-pods/email-pods.component';
import { PrintPodsComponent } from './modals/print-pods/print-pods.component';
import { DeletePodComponent } from './pages/delete-pod/delete-pod.component';


@NgModule({
  declarations: [PodsComponent, PodsViewComponent, EmailPodsComponent, PrintPodsComponent, DeletePodComponent],
  imports: [
    CommonModule,
    CoreModule,
    BrowserModule,
    FormsModule,
    PodsRoutingModule
  ]
})
export class PodsModule { }
