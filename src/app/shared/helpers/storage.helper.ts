import { Injectable }   from '@angular/core';
import { environment }  from '@env/environment';
import { StorageKey }   from '@enums/storage-key.enum';
import { Observable, of } from 'rxjs';
// import { AuthResponse } from '@models/auth-response.model';

@Injectable()
export class StorageHelper {
  private static secure: boolean = true;
  // private static storagePrefix : string = environment.appName + '_' + environment.version + '_';
  private static storagePrefix: string = '@' + environment.version + '_';

  public static setToken(token: string): void {
    StorageHelper.setItem(StorageKey.TOKEN, token);
  }

  public static removeToken(): void {
    StorageHelper.removeItem(StorageKey.TOKEN);
  }

  public static getToken(): string | null {
    const data = StorageHelper.getItem(StorageKey.TOKEN);
    return data ? data : null;
  }

  public static setUser(token: string): void {
    StorageHelper.setItem(StorageKey.USER, token);
  }

  public static removeUser(): void {
    StorageHelper.removeItem(StorageKey.USER);
  }

  public static getUser(): string | null {
    const data = StorageHelper.getItem(StorageKey.USER);
    return data ? data : null;
  }

  public static setMenu(menu: any): void {
    StorageHelper.setItem(StorageKey.MENU, menu);
  }

  public static removeMenu(): void {
    StorageHelper.removeItem(StorageKey.MENU);
  }

  public static getMenu(): any | null {
    const data = StorageHelper.getItem(StorageKey.MENU);
    return data ? data : null;
  }

  public static setUserDtls(userDetails: any): void {
    StorageHelper.setItem(StorageKey.USER_DETAILS, userDetails);
  }

  public static removeUserDtls(): void {
    StorageHelper.removeItem(StorageKey.USER_DETAILS);
  }

  public static getUserDtls(): any | null {
    const data = StorageHelper.getItem(StorageKey.USER_DETAILS);
    return data ? data : null;
  }

  public static setFullScreen(value: any): void {
    StorageHelper.setItem(StorageKey.FULL_SCREEN, value);
  }

  public static removeFullScreen(): void {
    StorageHelper.removeItem(StorageKey.FULL_SCREEN);
  }

  public static getFullScreen(): any | null {
    const data = StorageHelper.getItem(StorageKey.FULL_SCREEN);
    return data ? data : null;
  }

  public static getMenus(): Observable<any[]> {
    const data = StorageHelper.getItem(StorageKey.MENU);
    return data ? of(data) : of(null);
  }

  public static setItem(key: string, value: any, prefix: boolean = true): void {
    const itemKey = this.prefixer(key, prefix);
    // localStorage.setItem(itemKey, JSON.stringify(value));

    this.removeItem(key, prefix);
    let d = new Date();
    let data: any = {
      id: Math.random() * d.getTime(),
      data: value,
      time: d.getTime(),
    };
    data = JSON.stringify(data);
    if (this.secure) {
      data = encodeURIComponent(btoa(data));
    }
    localStorage.setItem(itemKey, data);
  }

  public static getItem(key: string, prefix: boolean = true): any {
    const itemKey = this.prefixer(key, prefix);
    /*const res = localStorage.getItem(itemKey);
    if (res !== 'undefined')
      return JSON.parse(res as any);
    return null;*/

    let jsonData: any = localStorage.getItem(itemKey);
    if (jsonData !== 'undefined' && jsonData != null) {
      if (this.secure) {
        jsonData = atob(decodeURIComponent(jsonData));
      }
      jsonData = JSON.parse(jsonData as any);

      return jsonData.data;
    } else {
      return null;
    }
  }

  public static removeItem(key: string, prefix: boolean = true): void {
    const itemKey = this.prefixer(key, prefix);
    localStorage.removeItem(itemKey);
  }

  public static getKeys(all: boolean = false): string[] {
    const keys: string[] = [];
    for (const key in localStorage) keys.push(key);
    if (all) return keys;
    return keys.filter((item) => item.startsWith(this.storagePrefix));
  }

  public static clearItems(all: boolean = false): void {
    if (all) {
      localStorage.clear();
      return;
    }
    const prefixedKeys = this.getKeys();
    for (const prefixedKey of prefixedKeys) {
      if (prefixedKeys.indexOf('@') == 0) {
        this.removeItem(prefixedKey, false);
      }
    }
  }

  public static clearItemsWithoutCurrentPrefix(): void {
    const allKeys = this.getKeys(true);
    for (const key of allKeys)
      if (!key.startsWith(this.storagePrefix)) this.removeItem(key, false);
  }

  private static prefixer(key: string, autoPrefix: boolean): string {
    let itemKey = key;
    if (autoPrefix) {
      itemKey = this.storagePrefix + key;
    }
    return itemKey;
  }
}
