import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  SimpleChange,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageHelper } from '@helpers/storage.helper';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '@services/app.service';

@Component({
  selector: 'app-side-menu-bar',
  templateUrl: './side-menu-bar.component.html',
  styleUrls: ['./side-menu-bar.component.scss'],
})
export class SideMenuBarComponent {
  @Output() collapseEvent: any = new EventEmitter<void>();
  sidebarCollapse = {
    click: false,
    hover: false,
  };
  menus: any[] = [];
  activeMenuItem: string | null = null;
  iconBasePath: string = '../../../../../assets/img/project/navbar/';
  currentRoute: any;
  selectedMenu: any;

  constructor(
    private httpService: AppService,
    config: NgbDropdownConfig,
    private route: ActivatedRoute
  ) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = false;
  }

  public ngOnInit(): void {
    this.getMenu();
    this.currentRoute =
      '/' + this.route.snapshot.routeConfig?.path?.split('/')[0];
    this.menus.map((menu) => {
      if (menu.basePath == this.currentRoute) {
        this.selectedMenu = menu;
        menu.collapse = false;
        menu.active = true;
      }
    });
  }

  public async getMenu() {
    try {
      //GET MENU BY API CALL
      // const response: any = await this.httpService.getMenu();
      // this.menus = response?.data;

      // GET MENU FROM LOCAL STORAGE
      this.menus = StorageHelper.getMenu();

      this.menus.map((item) => {
        item.collapse = true;
        item.active = false;
      });
    } catch (error) {}
  }

  public toggleShow(event: any) {
    if (event.target.nextElementSibling)
      event.target.nextElementSibling.classList.toggle('show');
  }

  setActiveMenuItem(menuItemName: string) {
    this.activeMenuItem = menuItemName;
  }

  collapseSidebar() {
    this.sidebarCollapse.click = !this.sidebarCollapse.click;
    // console.log('click', this.sidebarCollapse.click, 'hover', this.sidebarCollapse.hover);
    if (this.sidebarCollapse.click) {
      this.menus.map((item) => (item.collapse = true));
      setTimeout(() => {
        this.collapseEvent.emit();
        this.sidebarCollapse.hover = true;
        document.querySelector('.sidebar-wrapper')?.classList.add('collapse');
      }, 200);
    } else {
      this.sidebarCollapse.hover ? this.collapseEvent.emit() : null;
      this.sidebarCollapse.hover = false;
      document.querySelector('.sidebar-wrapper')?.classList.remove('collapse');
      setTimeout(() => {
        this.selectedMenu.collapse = false;
      }, 200);
    }
  }

  toggleCollapse() {
    

    if (this.sidebarCollapse.hover) {
      this.collapseEvent.emit();
    document.querySelector('.sidebar-wrapper')?.classList.toggle('collapse');
    setTimeout(() => {
      this.selectedMenu.collapse = !this.selectedMenu.collapse;
      this.sidebarCollapse.hover = !this.sidebarCollapse.hover;
    }, 200);
    } else {
      this.selectedMenu.collapse = !this.selectedMenu.collapse;
      this.sidebarCollapse.hover = !this.sidebarCollapse.hover;
      
    setTimeout(() => {
      this.collapseEvent.emit();
    document.querySelector('.sidebar-wrapper')?.classList.toggle('collapse');
    }, 200);
    }
  }
}
