import { Component, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageHelper } from '@helpers/storage.helper';
import { AppService } from '@services/app.service';
import {ToastService} from "@services/toast-service";

@Component({
  selector: 'app-sub-menus',
  templateUrl: './sub-menus.component.html',
  styleUrls: ['./sub-menus.component.scss'],
})
export class SubMenusComponent {
  form: FormGroup | undefined;

  update: boolean = false;
  fields: any = [
    { key: 'index', label: 'SL' },
    { key: 'submenu_name', label: 'Sub-Menu', sortable: true },
    { key: 'submenu_text_eng', label: 'Sub-Menu Text' },
    { key: 'submenu_text_bng', label: 'Sub-Menu Text (Bengali)' },
    // {key: 'parent_submenu.submenu_name', label: 'Parent Sub-menu', sortable: true},
    { key: 'menu.menu_name', label: 'Menu' },
    { key: 'menu_order_no', label: 'Order No.', sortable: true },
    // { key: 'action2', label: 'Active', class: 'text-center', sortable: true },
    // {key: 'action', class: 'text-center'}
  ];
  items: any[] = [];
  totalList: number = 0;
  perPage: number = 10;
  formData: any = {
    submenuId: null,
    submenuName: null,
    submenuTextEng: null,
    submenuTextBng: null,
    parentSubmenuId: null,
    menu: {
      menuId: null,
    },
    controllerName: null,
    actionName: null,
    routeName: null,
    menuOrderNo: null,
    activeYn: 'Y',
  };
  selectedParentSubmenu: any = {
    submenuId: null,
    submenuName: null,
  };
  selectedMenu: any = {
    menuId: null,
    menuName: null,
  };

  parentSubmenuOptions: any[] = [];
  menuOptions: any[] = [];
  subMenuList: any[] = [];
  paginationList: any[] = [];

  searchItemValue: string = '';
  tableSizes: any = [10, 20, 50, 100];
  pageSize: number = this.tableSizes[0];
  currentPage: number = 1;
  showSubMenuList: any[] = [];
  tempSubMenuList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService,
    private toastService: ToastService
  ) {}

  ngAfterViewInit() {
    this.loadMenus();
    this.loadSubmenus();
  }

  async loadMenus() {
    try {
      const response: any = await this.httpService.loadMenu();
      if (response?.status === 200) {
        this.menuOptions = [];
        for (let v of response.data) {
          this.menuOptions.push({ value: v.menuId, label: v.menuName });
        }
      }
    } catch (e) {}
  }

  async loadSubmenus() {
    try {
      const response: any = await this.httpService.getSubMenuList();
      this.subMenuList = response?.data;
      this.tempSubMenuList = this.subMenuList;
      this.paginationList = this.splitArray(this.subMenuList, this.pageSize);
      this.showSubMenuList = this.paginationList[this.currentPage - 1];
    } catch (e) {}
  }


  async onSubmit() {
    try {
      if (!this.formData.$invalid) {
        if (!this.update) {
          this.formData.menu.menuId = this.selectedMenu.menuId;
          const response: any = await this.httpService.saveSubmenu(
            this.formData
          );
          if (response.status === 200) {
            this.toastService.show('Data inserted successfully!', {classname: 'bg-success', delay: 3000});
            this.loadSubmenus();
          }else{
            this.toastService.show('Error', {classname: 'bg-danger', delay: 3000});
          }
        } else {
          this.formData.menu.menuId = this.selectedMenu.menuId;
          const response: any = await this.httpService.updateSubmenu(
            this.formData
          );
          if (response.status === 200) {
            this.toastService.show('Data updated successfully!', {classname: 'bg-success', delay: 3000});
            this.update = false;
            this.loadSubmenus();
          }else{
            this.toastService.show('Error', {classname: 'bg-danger', delay: 3000});
          }
        }

        // GET MENU BY API CALL AND SET TO LOACL STORAGE
        const menuResponse = await this.httpService.getMenu();
        if (menuResponse) {
          StorageHelper.setMenu(menuResponse.data);
        }
        this.refreshPage();
      }
    } catch (e: any) {
      this.toastService.show('Error: ' + e.response.data, {classname: 'bg-danger', delay: 3000});
    }
  }

  onReset(): void {
    this.update = false
    this.formData.submenuId = null
    this.formData.submenuName = null
    this.formData.submenuTextEng = null
    this.formData.submenuTextBng = null
    this.formData.parentSubmenuId = null
    this.formData.menuId = null
    this.formData.controllerName = null
    this.formData.actionName = null
    this.formData.routeName = null
    this.formData.menuOrderNo = null
    this.formData.activeYn = 'Y'
  }

  enableEdit(data: any) {
    this.update = true
    this.formData.submenuId = data.submenuId;
    this.formData.submenuName = data.submenuName;
    this.formData.submenuTextEng = data.submenuTextEng;
    this.formData.submenuTextBng = data.submenuTextBng;
    this.formData.menu.menuId = data.menuId;
    this.formData.controllerName = data.controllerName;
    this.formData.actionName = data.actionName;
    this.formData.routeName = data.routeName;
    this.formData.menuOrderNo = data.menuOrderNo;
    this.formData.activeYn = data.activeYn;

    this.selectedMenu.menuId = data.menuId;
  }

  splitArray(array: any[], size: any) {
    let result = [];
    for (let i = 0; i < array.length; i += size) {
      let chunk = array.slice(i, i + size);
      result.push(chunk);
    }
    return result;
  }

  onChangePage(selectedPage: any) {
    this.currentPage = selectedPage;
    this.showSubMenuList = this.paginationList[this.currentPage - 1];
  }

  onChangePageSize() {
    this.paginationList = this.splitArray(this.subMenuList, this.pageSize);
    this.showSubMenuList = this.paginationList[this.currentPage - 1];
  }


  searchItem() {
    this.showSubMenuList = this.tempSubMenuList;

    if (this.searchItemValue.trim()) {
      this.showSubMenuList = this.showSubMenuList.filter(row => {
        if(row.submenuName != null){const searchWords = row.submenuName.toLowerCase().split(' ');
        return searchWords.some((searchWord: any) => {
          return searchWord.toLowerCase().startsWith(this.searchItemValue.toLowerCase());
        })}
      }).slice(0, this.pageSize);
    }
    else {
      this.onChangePageSize()
    }
  }

  refreshPage() {
    window.location.reload();
  }
}
