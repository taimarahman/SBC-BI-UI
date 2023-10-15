import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-tree-menu',
  templateUrl: './tree-menu.component.html',
  styleUrls: ['./tree-menu.component.scss'],
})
export class TreeMenuComponent {
  @Input() menus: any[] = [];
  @Input() permittedList: any[] = [];
  @Output() saveEvent = new EventEmitter<any>();

  reqPermissionList: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    this.resetMenuInfo();
    this.setMenuInfo();
    this.saveEvent.next(this.reqPermissionList);
  }

  public resetMenuInfo() {
    if (this.menus.length > 0) {
      for (let menu of this.menus) {
        menu.checked = false;
        if (menu.subMenus.length > 0) {
          for (let submenu of menu.subMenus) {
            submenu.checked = false;
          }
        }
      }
    }
  }

  public setMenuInfo() {
    this.reqPermissionList = [];
    for (let list of this.permittedList) {
      let pMenu = this.menus.find((item) => item.menuId == list.menuId);

      if (pMenu) {
        pMenu.checked = true;
        if (list.submenuIds.length > 0) {
          for (let sublist of list.submenuIds) {
            let pSubMenu = pMenu.subMenus.find(
              (item: any) => item.submenuId == sublist
            );
            if (pSubMenu) {
              pSubMenu.checked = true;
            }

          }
        }
      }
      //  UPDATE LIST FOR ACCESS REQUEST SAVE
      let menuAccess: any = {
        menuId: list.menuId,
        submenuIds: list.submenuIds,
      };

      this.reqPermissionList.push(menuAccess);
    }
  }

  addToReqAccessList(event: any, menu: any, idx: any) {
    if (event.target.checked) {
      menu.checked = true;

      let menuAccess: any = {
        menuId: menu.menuId,
        submenuIds: [],
      };
      this.reqPermissionList.push(menuAccess);
      this.saveEvent.next(this.reqPermissionList);
    } else {
      menu.checked = false;
      this.reqPermissionList = this.reqPermissionList.filter(
        (item) => item.menuId != menu.menuId
      );

      // REMOVE CHECKED FROM ALL THE SUBMENUS WHEN MENU IS UNCHECKED

      if (menu.subMenus.length > 0) {
        menu.subMenus.map((item: any) => (item.checked = false));
      }
    }
  }

  addSubMenuAccess(event: any, menuId: any, submenu: any) {
    let selectedMenu = this.reqPermissionList.find(
      (item) => item.menuId == menuId
    );
    if (selectedMenu) {
      if (event.target.checked) {
        submenu.checked = true;
        selectedMenu.submenuIds.push(submenu.submenuId);
      } else {
        submenu.checked = false;
        selectedMenu.submenuIds = selectedMenu.submenuIds.filter(
          (item: any) => item != submenu.submenuId
        );
      }
    }

    this.saveEvent.next(this.reqPermissionList);
  }
}
