// Angular modules
import { CommonModule }             from '@angular/common';
import { NgModule }                 from '@angular/core';

// Internal modules
import { AuthRoutingModule }        from './auth-routing.module';
import { SharedModule }             from '../../shared/shared.module';

// Components
import { AuthComponent }            from './auth/auth.component';
import { LoginComponent }           from './auth/login/login.component';

@NgModule({
  declarations    :
  [
    AuthComponent,
    LoginComponent,
  ],
  imports         :
  [
    CommonModule,
    AuthRoutingModule,

    SharedModule,
  ],
})
export class AuthModule { }
