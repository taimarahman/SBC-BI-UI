import { Component, Input, NgZone, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppService } from '@services/app.service';
import {ToastService} from "@services/toast-service";

@Component({
  selector: 'app-assign-role-to-user',
  templateUrl: './assign-role-to-user.component.html',
  styleUrls: ['./assign-role-to-user.component.scss'],
})
export class AssignRoleToUserComponent {
  @Input() userIdFromSearch: any;

  constructor(
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private httpService: AppService,
    private toastService: ToastService,
  ) {}

  tempRoleList: any[] = [];
  searchRole = '';
  errorMessage: any = { color: 'red' };
  moreAdd: any = {};
  modalShow: boolean = false;
  show: boolean = true;
  keepDisable: boolean = false;
  userSelected: boolean = true;
  assignRolesToUser: any = {
    userId: null,
    roles: [],
  };
  employee: any = {};
  userList: any[] = [];
  roleList: any[] = [];
  assignedRoles: any[] = [];
  selectedUser: any = {
    userId: null,
    userName: null,
  };

  ngOnInit() {
    this.loadUsers();
    this.loadData().then((r) => {
      this.selectedUser.userId = this.userIdFromSearch;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userIdFromSearch'].firstChange) {
      this.loadData().then((r) => {
        this.selectedUser.userId = this.userIdFromSearch;
      });
    }
    if (!changes['userIdFromSearch'].firstChange) {
      this.selectedUser.userId = this.userIdFromSearch;
    }
  }

  searchRoles() {
    this.roleList = this.tempRoleList;

    if (this.searchRole.trim()) {
      this.roleList = this.roleList.filter((row) => {
        const searchWords = row.label.toLowerCase().split(' ');
        return searchWords.some((searchWord: any) => {
          return searchWord
            .toLowerCase()
            .startsWith(this.searchRole.toLowerCase());
        });
      });
    }

    // this.roleList = this.tempRoleList;
    //
    // if(this.searchRole.trim()) {
    //   this.roleList = this.roleList.filter(row => {
    //     return row.label.toLowerCase().includes(this.searchRole.toLowerCase())
    //   });
    // }
  }

  async onSubmit() {
    try {
      let data = {
        userId: this.selectedUser.userId,
        roles: [],
      };
      for (let role of this.roleList) {
        if (role.checked) {
          // @ts-ignore
          data.roles.push(role.value);
        }
      }
      const response: any = await this.httpService.saveUserRole(data);
      if (response?.status === 200) {
        this.getRolesOfUser();
        this.toastService.show('Success', {classname: 'bg-success', delay: 3000});
      }
      else{
        this.toastService.show('Error', {classname: 'bg-danger', delay: 3000});
      }
    } catch (e) {}
  }

  async getRolesOfUser() {
    try {
      if (this.userIdFromSearch) {
        this.selectedUser.userId = this.userIdFromSearch;
      }
      this.loadUserInfo(this.selectedUser.userId)
      const response: any = await this.httpService.getRolesOfUser(this.selectedUser.userId);
      if (response?.status === 200) {
        this.assignedRoles = [];
        for (const role1 of response.data) {
          this.assignedRoles.push({ roleName: role1.roleName });
        }
        for (const role2 of this.roleList) {
          role2.checked = false;
        }
        for (const role1 of response.data) {
          for (const role2 of this.roleList) {
            if (role1.roleId === role2.value) {
              role2.checked = true;
            }
          }
        }
      }
    } catch (e) {}
  }

  async loadData() {
    try {
      const response: any = await this.httpService.getRoleList();
      if (response?.status === 200) {
        this.roleList = [];
        for (let v of response.data) {
          this.roleList.push({
            value: v.roleId,
            label: v.roleName,
            checked: false,
          });
        }
        this.tempRoleList = this.roleList;
      }
    } catch (e) {}
  }

  async loadUsers() {
    try {
      const response: any = await this.httpService.loadUsers();
      if (response?.status === 200) {
        this.userList = [];
        for (let v of response.data) {
          this.userList.push({ value: v.userId, label: v.username });
        }
      }
    } catch (e) {}
  }

  changeCheck(idx: any) {
    this.roleList[idx].checked = !this.roleList[idx].checked;
  }

  async loadUserInfo(userId: any){
    try {
      const response: any = await this.httpService.loadUser(userId);
      if (response?.status === 200) {
        this.employee = response.data
      }
    } catch (e) {}
  }
}
