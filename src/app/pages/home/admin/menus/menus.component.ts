import { Component, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '@services/app.service';
import { Location } from '@angular/common';
import { StorageHelper } from '@helpers/storage.helper';
import {ToastService} from "@services/toast-service";

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss'],
})
export class MenusComponent {
  form: FormGroup | undefined;

  update: boolean = false;
  fields: any = [
    { key: 'index', label: 'SL' },
    { key: 'menuName', label: 'Menu', sortable: true },
    { key: 'menuTextEng', label: 'Menu Text' },
    { key: 'menuTextBng', label: 'Menu Text (Bengali)' },
    // { key: 'module.module_name', label: 'Module', sortable: true },
    { key: 'menuOrderNo', label: 'Order No.', sortable: true },
    { key: 'baseUrl', label: 'Base URL' },
    /*{key: 'bg_color', label: 'BG Color'},*/
    { key: 'basePath', label: 'Base Path' },
    { key: 'icon', label: 'Icon & BG Color' },
    // { key: 'activeYn', label: 'Active', class: 'text-center', sortable: true },
    // { key: 'action', class: 'text-center' },
  ];
  searchItemValue: string = '';
  tableSizes: any = [10, 20, 50, 100];
  pageSize: number = this.tableSizes[0];
  currentPage: number = 1;
  menuList: any[] = [];
  paginationList: any[] = [];
  showMenuList: any[] = [];
  tempMenuList: any[] = [];

  formData: any = {
    menuId: null,
    menuName: null,
    menuTextEng: null,
    menuTextBng: null,
    // moduleId: null,
    menuOrderNo: null,
    activeYn: 'Y',
    dashboardVisibleYn: 'Y',
    baseUrl: null,
    icon: null,
    bgColor: null,
    basePath: null,
  };

  selectedModule: any = {
    moduleId: null,
    moduleName: null,
  };

  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngAfterViewInit() {
    // this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedModule'] && changes['selectedModule'].currentValue) {
      const newVal = changes['selectedModule'].currentValue;
      this.formData.moduleId = newVal.moduleId || null;
    }
  }

  ngOnInit() {
    this.currentPage = 1;

    this.loadMenus();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      menuId: [null],
      menuName: [null, Validators.required],
      menuTextEng: [null],
      menuTextBng: [null],
      moduleId: [null, Validators.required],
      menuOrderNo: [null, Validators.required],
      activeYn: ['Y'],
      dashboardVisibleYn: ['Y'],
      baseUrl: [null],
      icon: [null],
      bgColor: [null],
      basePath: [null],
    });
  }

  provider(items: any) {}

  async loadMenus() {
    try {
      const response: any = await this.httpService.getMenuList();
      this.menuList = response?.data;
      // console.log(Object.keys(this.menuList[0]))
      this.tempMenuList = this.menuList;
      this.paginationList = this.splitArray(this.menuList, this.pageSize);
      this.showMenuList = this.paginationList[this.currentPage - 1];
    } catch (error) {}
  }

  async onSubmit() {
    try {
      if (!this.formData.$invalid) {
        if (!this.update) {
          const response: any = await this.httpService.saveMenu(this.formData);
          if (response.status === 200) {
            this.toastService.show('Data inserted successfully!', {classname: 'bg-success', delay: 3000});
            this.loadMenus();
          }
          else{
            this.toastService.show('Error', {classname: 'bg-danger', delay: 3000});
          }
        } else {
          const response: any = await this.httpService.updateMenu(
            this.formData
          );
          if (response.status == 200) {
            this.toastService.show('Data updated successfully!', {classname: 'bg-success', delay: 3000});
            this.update = false;
            this.loadMenus();
          }
          else{
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

  onReset() {
    this.update = false;
    this.formData.menuId = null;
    this.formData.menuName = null;
    this.formData.menuTextEng = null;
    this.formData.menuTextBng = null;
    this.formData.menuOrderNo = null;
    this.formData.activeYn = 'Y';
    this.formData.dashboardVisibleYn = 'Y';
    this.formData.baseUrl = null;
    this.formData.icon = null;
    this.formData.bgColor = null;
    this.formData.basePath = null;
  }

  enableEdit(data: any) {
    this.update = true;
    this.formData.menuId = data.menuId;
    this.formData.menuName = data.menuName;
    this.formData.menuTextEng = data.menuTextEng;
    this.formData.menuTextBng = data.menuTextBng;
    this.formData.menuOrderNo = data.menuOrderNo;
    this.formData.activeYn = data.activeYn;
    this.formData.dashboardVisibleYn = data.dashboardVisibleYn;
    this.formData.baseUrl = data.baseUrl;
    this.formData.icon = data.icon;
    this.formData.bgColor = data.bgColor;
    this.formData.basePath = data.basePath;
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
    this.showMenuList = this.paginationList[this.currentPage - 1];
  }

  onChangePageSize() {
    this.paginationList = this.splitArray(this.menuList, this.pageSize);
    this.showMenuList = this.paginationList[this.currentPage - 1];
  }

  searchItem() {
    this.showMenuList = this.tempMenuList;

    if (this.searchItemValue.trim()) {
      this.showMenuList = this.showMenuList
        .filter((row) => {
          if (row.menuName != null) {
            const searchWords = row.menuName?.toLowerCase().split(' ');
            return searchWords.some((searchWord: any) => {
              return searchWord
                .toLowerCase()
                .startsWith(this.searchItemValue.toLowerCase());
            });
          }
        })
        .slice(0, this.pageSize);
    } else {
      this.onChangePageSize();
    }
  }

  refreshPage() {
    window.location.reload();
  }
}
