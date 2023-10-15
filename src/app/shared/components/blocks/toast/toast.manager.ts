// Angular modules
import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'info' | 'warning' | 'danger';

export class Toast
{
  public   id         !: number
  readonly headerKey  ?: string;
  public   withHeader  : boolean;
  public   body        : string;
  public   type        : ToastType;
  public   autoHide    : boolean;
  public   delay       : number;

  constructor(body : string, type ?: ToastType, autoHide : boolean = true)
  {
    this.withHeader = true;
    this.body       = body;
    this.type       = type ?? 'danger';
    this.autoHide   = autoHide;
    this.delay      = 3000; // 1 sec



    switch (type) {
      case 'danger':
        this.headerKey  = 'Error';
        break;
      case 'success':
        this.headerKey  = 'Success';
        break;
      default:
        this.headerKey  = this.type.toUpperCase();
        break;
    }

  }
}

@Injectable({ providedIn : 'root' })
export class ToastManager
{
  public  toasts  : Toast[] = [];
  private counter : number  = 0;

  constructor() {}

  public show(toast : Toast) : void
  {
    toast.id = this.counter++;
    this.toasts.push(toast);
  }

  public quickShow(body : string, type ?: ToastType, autoHide : boolean = true) : void
  {
    const toast = new Toast(body, type, autoHide);
    this.show(toast);
  }

  public remove(id : number) : void
  {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
