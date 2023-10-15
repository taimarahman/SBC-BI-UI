import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppService } from "@services/app.service";
import { StorageHelper } from "@helpers/storage.helper";
import { log } from 'console';
import { Session } from 'inspector';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private http: AppService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // let token = localStorage.getItem("token");
    let token = StorageHelper.getToken();
    //console.log("Token form authGuard:-",token);
    // if (token == undefined || token == "" || token == null) {
    //   this.router.navigate(['']);
    //   //console.log("false",token);
    //   return false;
    // } else {
    //   //console.log("True",token);
    //   return true;
    // }
    if (!this.http.isTokenExpired() && token !== undefined && token !== "" && token !== null) {
      return true;
    } else {
      alert('Your session has expired. Please log in again to continue.')
      this.router.navigate(['']);
      while (StorageHelper.getToken()) {
        StorageHelper.removeToken();
        StorageHelper.removeMenu();
        StorageHelper.removeUser();
      }
      //console.log("false",token);
      return false;
    }

  }

}
