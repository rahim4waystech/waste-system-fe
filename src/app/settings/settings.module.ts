import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './pages/settings/settings.component';
import { UsersComponent } from './pages/users/users.component';
import { CoreModule } from '../core/core.module';
import { UsersNewComponent } from './pages/users-new/users-new.component';
import { UserFormComponent } from './partials/user-form/user-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { UsersEditComponent } from './pages/users-edit/users-edit.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { PersonalisationFormComponent } from './partials/personalisation-form/personalisation-form.component';
import { EnvironmentComponent } from './pages/environment/environment.component';
import { EnvironmentFormComponent } from './partials/environment-form/environment-form.component';
import { UserRolesComponent } from './pages/user-roles/user-roles.component';
import { UserRoleNewComponent } from './pages/user-role-new/user-role-new.component';
import { UserRoleFormComponent } from './partials/user-role-form/user-role-form.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UserRoleEditComponent } from './pages/user-role-edit/user-role-edit.component';


@NgModule({
  declarations: [SettingsComponent, UsersComponent, UsersNewComponent, UserFormComponent, UsersEditComponent, UserProfileComponent, PersonalisationFormComponent, EnvironmentComponent, EnvironmentFormComponent, UserRolesComponent, UserRoleNewComponent, UserRoleFormComponent, UserRoleEditComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    NgMultiSelectDropDownModule.forRoot(),
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
