import { Component } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { StoreService } from '@services/store.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  

  public menus: any[]= [
    {
      'id':1,
      'name':'Home',
      'link':'/dashboard',
      'parent_id':0
    },
    {
      'id':2,
      'name':'Fees Collection',
      'link':'/new-vehicles',
      'parent_id':0
    },
    {
      'id':3,
      'name':'Utilities',
      'link':'/utilities',
      'parent_id':0
    },
    {
      'id':4,
      'name':'Duplicate Tax Token',
      'link':'/print-duplicate-tax-token',
      'parent_id':0
    },
    {
      'id':5,
      'name':'Reports',
      'link':'/reports',
      'parent_id':0
    },

    {
      'id':6,
      'name':'New Vehicle',
      'link':'/new-vehicles',
      'parent_id':2
    },
    {
      'id':7,
      'name':'Existing Vehicle',
      'link':'/existing-vehicle',
      'parent_id':2
    },
    {
      'id':8,
      'name':'New Driving License',
      'link':'/new-driving-license',
      'parent_id':2
    },
    {
      'id':9,
      'name':'Existing Driving License',
      'link':'/existing-driving-license',
      'parent_id':2
    },
    {
      'id':10,
      'name':'Foreign Driving License',
      'link':'/foreign-driving-license',
      'parent_id':2
    },
    {
      'id':11,
      'name':'Fixed Fees',
      'link':'/fixed-fees',
      'parent_id':2
    },
    {
      'id':12,
      'name':'Change Password',
      'link':'/utilities',
      'parent_id':3
    },
    {
      'id':13,
      'name':'Transaction Cancel',
      'link':'/transaction-cancel',
      'parent_id':3
    },
    {
      'id':14,
      'name':'Print Duplicate Tax Token',
      'link':'/print-duplicate-tax-token',
      'parent_id':4
    },
    {
      'id':15,
      'name':'Duplicate Tax Token [Closed Branches]',
      'link':'/print-duplicate-tax-token-cb',
      'parent_id':4
    }
  ];

  public activePah:string='';
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private StoreService:StoreService)
  {
    /*console.log(this.router.url, this.activatedRoute.snapshot.url);
    console.log(router.routerState.snapshot.url);
    console.log(this.menus)

    console.log('Path:' + window.location.pathname);
    console.log('URL:' + window.location.href);
    console.log('Host:' + window.location.host);
    console.log('Hostname:' + window.location.hostname);
    console.log('Origin:' + window.location.origin);
    console.log('Port:' + window.location.port);
    console.log('Search String:' + window.location.search);*/

    this.activePah = window.location.pathname;
    // this.activePah = '/new-vehicles';
    // this.activePah = '/dashboard';
    // this.activePah = '/utilities';
    // this.activePah = '/transaction-delete';
  }

  public ngOnInit() : void
  {
  }

  public getMenus(parent_id:any=0):any {
    return this.menus.filter(object =>   object.parent_id ==parent_id );
  }

  public getParents():any {
    return this.getMenus(0);
  }

  public getChilds():any{
    let menu = this.menus.find(object => {
      return (object.link == this.activePah && object.parent_id != 0);
    });

    if (menu !== undefined && menu.parent_id !=0) {
      return this.getMenus(menu.parent_id);
    }else{
      return false;
    }
  }

  public isParentActive(menu_id:any):boolean{
    let cmenu = this.menus.find(object => {
      return (object.link == this.activePah && object.parent_id != 0);
    });
    if (cmenu !== undefined && cmenu.parent_id ==menu_id ) {
      return true;
    }else{
      let pmenu = this.menus.find(object => {
        return (object.link == this.activePah);
      });
      if (pmenu !== undefined){
        return (pmenu.id == menu_id);
      }else{
        return false;
      }
    }
  }

  public isChildActive(menu_id:any):boolean{
    let menu = this.menus.find(object => {
      return (object.link == this.activePah && object.id == menu_id && object.parent_id != 0);
    });
    return (menu !== undefined );
  }

  get isLoading () {
    return this.StoreService.getIsLoading();
  }
}
