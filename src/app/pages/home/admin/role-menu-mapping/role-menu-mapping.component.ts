import { Component, SimpleChanges } from '@angular/core';
import { StorageHelper } from '@helpers/storage.helper';
import { AppService } from '@services/app.service';
import {ToastService} from "@services/toast-service";

@Component({
  selector: 'app-role-menu-mapping',
  templateUrl: './role-menu-mapping.component.html',
  styleUrls: ['./role-menu-mapping.component.scss'],
})
export class RoleMenuMappingComponent {
  id: any;
  tab: string = 'menu';
  show: boolean = false;
  roleList: any[] = [];
  menuTree: any[] = [];
  allReportList: any[] = [];
  allReportGrouped: any[] = [];
  permissions: any[] = [];
  reports: any[] = [];
  roleWisePermissionList: any[] = [];
  roleReportList: any[] = [];
  roleUserList: any[] = [];
  selectedRole: any = {
    roleId: null,
    roleName: null,
    roleKey: null,
    grantAllYn: null,
  };

  reqData: any = {
    roleId: null,
    menus: [],
  };

  reportReqData: any = {
    roleId: null,
    reportId: [],
  };

  // assignReqData

  constructor(
    private httpService: AppService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.onReset();
    this.allReportList = []
    // this.allReportGrouped = []
  }


  async loadRole() {
    try {
      const response: any = await this.httpService.getRoleList();
      if (response?.status === 200) {
        this.roleList = [];
        for (let v of response.data) {
          this.roleList.push({ value: v.roleId, label: v.roleName });
        }
      }
    } catch (e) {}
  }

  onReset() {
    this.loadRole();
    this.menuTree = StorageHelper.getMenu();
    this.getReportList();
    this.show = false;
    this.resetReportInfo();
    this.groupByPMN(this.allReportList, this.allReportGrouped);

  }

  async saveReport() {
    try {
      const response = await this.httpService.saveRoleWiseReportAccess(
        this.reportReqData
      );
      if (response) {
        this.toastService.show('Saved Successfully', {classname: 'bg-success', delay: 3000});
      }
    } catch (error) {}
  }

  checkAll(module: any) {
    // Implement the equivalent logic for checking all using Angular's TypeScript features
  }

  public async loadRolePermissions() {
    try {
      this.reqData.roleId = this.selectedRole.roleId;
      this.reportReqData.roleId = this.selectedRole.roleId;
      this.show = true;

      // MENU SUBMENU LIST
      const response: any = await this.httpService.getRolePermissionList(
        this.selectedRole.roleId
      );
      this.roleWisePermissionList = response?.data;

      // REPORT LIST
      const reportRes: any = await this.httpService.getRoleReportPermissionList(
        this.selectedRole.roleId
      );
      this.roleReportList = reportRes.data;
      this.resetReportInfo();
      this.setReportInfo();
      this.groupByPMN(this.allReportList, this.allReportGrouped);

      // USER LIST
      const userRes: any = await this.httpService.getRoleWiseUserList(
        this.selectedRole.roleId
      );
      this.roleUserList = userRes.data;
    } catch (error) {}
  }

  public setMenuSaveData(menuList: any) {
    this.reqData.menus = menuList;
  }

  public async saveMenuAccess() {
    try {
      const response = await this.httpService.saveRoleWiseMenuSubmenuAccess(
        this.reqData
      );
      if (response) {
        this.toastService.show('Saved Successfully', {classname: 'bg-success', delay: 3000});
      }
    } catch (error) {}
  }

  //REPORT SECTION
  public async getReportList() {
    try {
      const response = await this.httpService.getReportList();
      this.allReportList = response?.data;
      // if(this.allReportList.length > 0) this.groupByPMN(this.allReportList, this.allReportGrouped);
    } catch (error) {}
  }

  groupByPMN(res: any, list: any) {
    // list = [];
    for (const item of res) {
      const parentModuleId = item.parentModuleId;

      if (!list[parentModuleId]) {
        list[parentModuleId] = [];
      }
      list[parentModuleId].push(item);
    }
  }

  toggleToReportAccess(event: any, report: any) {
    if (event.target.checked) {
      report.checked = true;
      this.reportReqData.reportId.push(report.reportId);
    } else {
      report.checked = false;

      this.reportReqData.reportId = this.reportReqData.reportId.filter(
        (item: any) => item != report.reportId
      );
    }
  }

  setReportInfo() {
    this.reportReqData.reportId = [];
    for (let list of this.roleReportList) {
      this.reportReqData.reportId.push(list.reportId);

      let pReport = this.allReportList.find(
        (item) => item.reportId == list.reportId
      );
      if (pReport) pReport.checked = true;
    }
  }

  resetReportInfo() {
    this.allReportList.map((item) => (item.checked = false));
  }


  // UNASSIGN USER FROM ROLE
  public async unassignUser(userId: any) {
    const res = await this.httpService.unassignUserRole(userId, this.selectedRole.roleId);
    if (res.status ==  200) {
      this.toastService.show('User Unassigned', {classname: 'bg-success', delay: 3000});
      const userRes: any = await this.httpService.getRoleWiseUserList(
        this.selectedRole.roleId
      );
      this.roleUserList = userRes.data;
    }


  }
}
