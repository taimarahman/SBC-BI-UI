// Angular modules
import { NgModule }                 from '@angular/core';
import { Routes }                   from '@angular/router';
import { RouterModule }             from '@angular/router';

// Components
import { AuthComponent }            from './auth/auth.component';
import { LoginComponent }           from './auth/login/login.component';

const routes : Routes = [

];

@NgModule({
  imports :
  [
    RouterModule.forChild(routes)
  ],
  exports :
  [
    RouterModule
  ],
  providers :
  [
  ]
})
export class AuthRoutingModule { }
