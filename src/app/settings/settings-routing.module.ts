import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { UsersComponent } from './pages/users/users.component';
import { UsersNewComponent } from './pages/users-new/users-new.component';
import { UsersEditComponent } from './pages/users-edit/users-edit.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { EnvironmentComponent } from './pages/environment/environment.component';
import { UserRolesComponent } from './pages/user-roles/user-roles.component';
import { UserRoleNewComponent } from './pages/user-role-new/user-role-new.component';
import { UserRoleEditComponent } from './pages/user-role-edit/user-role-edit.component';


const routes: Routes = [
  {path: 'settings',component: SettingsComponent},
  {path: 'settings/users',component: UsersComponent},
  {path: 'settings/environment',component: EnvironmentComponent},
  {path: 'settings/user/profile',component: UserProfileComponent},
  {path: 'settings/users/new',component: UsersNewComponent},
  {path: 'settings/users/edit/:id',component: UsersEditComponent},
  {path: 'settings/roles', component: UserRolesComponent},
  {path: 'settings/roles/new', component: UserRoleNewComponent},
  {path: 'settings/roles/edit/:id', component: UserRoleEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
