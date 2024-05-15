import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerRoutingModule } from './container-routing.module';
import { ContainerComponent } from './pages/container/container.component';
import { CoreModule } from '../core/core.module';
import { ContainerFormComponent } from './partials/container-form/container-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ContainersNewComponent } from './pages/containers-new/containers-new.component';
import { ContainersEditComponent } from './pages/containers-edit/containers-edit.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [ContainerComponent, ContainerFormComponent, ContainersNewComponent, ContainersEditComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    NgMultiSelectDropDownModule.forRoot(),
    ContainerRoutingModule
  ]
})
export class ContainerModule { }
