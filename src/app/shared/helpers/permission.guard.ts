import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AppService } from '@services/app.service';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import { catchError, map, switchMap } from 'rxjs/operators';
import { StorageHelper } from './storage.helper';

@Injectable({
  providedIn: 'root'
})

export class PermissionGuard implements CanActivate {
  constructor(private router: Router, private location: Location) {}

  private isRouteInMenu(menuItem: any, routePath: string): boolean {
    if (menuItem.routeName === routePath) {
      return true;
    }
    if (menuItem.subMenus && menuItem.subMenus.length > 0) {
      return menuItem.subMenus.some((subMenuItem: any) => this.isRouteInMenu(subMenuItem, routePath));
    }
    return false;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return StorageHelper.getMenus().pipe(
      switchMap(menuItems => {
        if (!menuItems || !Array.isArray(menuItems)) {
          // Handle the case where menuItems is not an array (e.g., user not authenticated)
          // Redirect the user to the login page or handle the error as needed
          this.router.navigate(['/login']);
          return [false];
        }
        // Check if the route path exists in the user's menu items (including sub-menus)
        const routeExistsInMenu = menuItems.some(item => this.isRouteInMenu(item, state.url));

        if (!routeExistsInMenu) {
          // Route is not in the user's menu items
          // Display an alert or handle it as needed
          alert('You are not Authorized this Menu. Access denied.');
          this.location.back();
          return [false];
        }

        // Route is in the user's menu items
        return [true];
      }),
      catchError(() => {
        // Handle errors when fetching user's menu (e.g., user not authenticated)
        // Redirect the user to the login page or handle the error as needed
        this.router.navigate(['/login']);
        return [false];
      })
    );
  }
}
