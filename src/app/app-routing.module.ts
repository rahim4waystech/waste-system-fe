import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ForbiddenComponent } from './core/pages/forbidden/forbidden.component';

 
const routes: Routes = [
   {
    path: '**',
    redirectTo: 'home',
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
