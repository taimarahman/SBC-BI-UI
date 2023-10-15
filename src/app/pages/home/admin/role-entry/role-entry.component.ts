import {Component} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AppService} from "@services/app.service";
import {ToastService} from "@services/toast-service";

@Component({
  selector: 'app-role-entry',
  templateUrl: './role-entry.component.html',
  styleUrls: ['./role-entry.component.scss'],
})
export class RoleEntryComponent {
  formData: any = {
    roleName: null,
    roleKey: null,
    activeYn: 'Y',
    roleId: null,
  };
  edit: boolean = false

  searchRole = "";
  tempRoleList: any[] = [];
  tableSizes: any = [10, 20, 50, 100];
  pageSize: number = this.tableSizes[0];
  currentPage: number = 1;
  paginationList: any[] = [];
  showRoleList: any[] = [];

  roleList: any[] = [];
  fields: any = [
    { key: 'index', label: 'SL' },
    { key: 'roleName', label: 'Role Name', sortable: true },
    { key: 'roleKey', label: 'Role Key', sortable: true },
    // { key: 'grantAllYn', label: 'Active Status' },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadRoleList();
  }

  async onSubmit() {
    try {
      if (!this.formData.$invalid) {
        if (!this.edit) {
          const response: any = await this.httpService.roleEntrySave(this.formData);
          if (response.status === 200) {
            this.toastService.show(response.data.message, {classname: 'bg-success', delay: 3000});
          } else {
            this.toastService.show('Error', {classname: 'bg-danger', delay: 3000});
          }
        } else {
          const response: any = await this.httpService.roleEntryUpdate(this.formData);
          if (response.status === 200) {
            this.toastService.show(response.data.message, {classname: 'bg-success', delay: 3000});
          } else {
            this.toastService.show('Error', {classname: 'bg-danger', delay: 3000});
          }
          this.edit = false
        }
        this.refreshPage()
      }
    } catch (e: any) {
      this.toastService.show('Error: ' + e.response.data, {classname: 'bg-danger', delay: 3000});
    }
  }

  onReset() {
    this.edit = false
    this.formData = {
      roleName: null,
      roleKey: null,
      activeYn: 'Y',
    };
  }

  async loadRoleList() {
    try {
      const response: any = await this.httpService.getRoleList();
      this.roleList = response?.data;
      this.tempRoleList = this.roleList;
      this.paginationList = this.splitArray(this.roleList, this.pageSize);
      this.showRoleList = this.paginationList[this.currentPage - 1];
    } catch (e) {}
  }

  enableEdit(data: any) {
    this.edit = true
    this.formData.roleName = data.roleName;
    this.formData.roleKey = data.roleKey;
    this.formData.activeYn = data.activeYn;
    this.formData.roleId = data.roleId;
  }

  refreshPage() {
    window.location.reload();
  }

  onChangePage(selectedPage: any) {
    this.currentPage = selectedPage;
    this.showRoleList = this.paginationList[this.currentPage - 1];
  }
  onChangePageSize() {
    this.paginationList = this.splitArray(this.roleList, this.pageSize);
    this.showRoleList = this.paginationList[this.currentPage - 1];
  }

  splitArray(array: any[], size: any) {
    let result = [];
    for (let i = 0; i < array.length; i += size) {
      let chunk = array.slice(i, i + size);
      result.push(chunk);
    }
    return result;
  }

  searchRoles() {
    this.showRoleList = this.tempRoleList;

    if (this.searchRole.trim()) {
      this.showRoleList = this.showRoleList.filter(row => {
        if(row.roleName != null){const searchWords = row.roleName.toLowerCase().split(' ');
        return searchWords.some((searchWord: any) => {
          return searchWord.toLowerCase().startsWith(this.searchRole.toLowerCase());
        })}
      }).slice(0, this.pageSize);
    }
    else {
      this.onChangePageSize()
    }
  }

  updateRoleKey() {
    this.formData.roleKey = this.formData.roleName.replace(/ /g, '_');
  }

}
