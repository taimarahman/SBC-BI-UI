import { Component } from '@angular/core';
import { AppService } from '@services/app.service';
import {ToastService} from "@services/toast-service";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {

  show = {
    createUser : false,
    searchUser: false,
    userTable: false,
    assignRole: false
  }

  fields: any = [
    { key: 'index', label: 'SL' },
    { key: 'userName', label: 'User Name', sortable: true },
    { key: 'userType', label: 'User Type' },
    { key: 'empolyeeName', label: 'Employee Name' },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'designation', label: 'Designation' },
    { key: 'email', label: 'Email' },
    // { key: 'activeYn', label: 'Active Status', class: 'text-center', sortable: true },
  ];

  tableSizes: any = [10, 20, 30, 50];
  pageSize: number = this.tableSizes[0];
  currentPage: number = 1;
  paginationList: any[] = [];
  searchUserList: any[] = [];
  showSearchUserList: any[] = [];
  tempSearchUserList: any[] = [];
  searchItemValue: string = '';
  editData:any = {};
  userId: any = null;

  constructor(
    private httpService: AppService,
    private toastService: ToastService
  ) {}

  ngOnInit(){
    this.show.createUser = true;
    this.loadSearchUserList
  }

  onClickSearchUser(eventData: { create: boolean; search: boolean; table: boolean }){
    this.show.createUser = eventData.create;
    this.show.searchUser = eventData.search;
    this.show.userTable = eventData.table;
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
    this.showSearchUserList = this.paginationList[this.currentPage - 1];
  }
  onChangePageSize() {
    console.log(this.pageSize);
    this.paginationList = this.splitArray(this.searchUserList, this.pageSize);
    this.showSearchUserList = this.paginationList[this.currentPage - 1];
  }
  searchItem() {
    this.showSearchUserList = this.searchUserList;

    if (this.searchItemValue.trim()) {
      this.showSearchUserList = this.showSearchUserList.filter(row => {
        return Object.values(row).some(value => {
          if (value != null && typeof value === 'string') {
            const searchWords = value.toLowerCase().split(' ');
            return searchWords.some(searchWord => {
              return searchWord.startsWith(this.searchItemValue.toLowerCase());
            });
          }
          return false;
        });
      }).slice(0, this.pageSize);
    }

    else {
      this.onChangePageSize()
    }
  }


  async loadSearchUserList(data:any) {
    try {

      const response: any = await this.httpService.loadSearchUserList(data);
      // console.log(response.data);
      if(response.status){
        this.searchUserList = response.data
        this.tempSearchUserList = this.searchUserList;
        this.paginationList = this.splitArray(this.searchUserList, this.pageSize);
        this.showSearchUserList = this.paginationList[this.currentPage - 1];
      }
    } catch (error) {
      console.log(error)
    }
  }

  editUser(userData:any){
    this.show.searchUser = false;
    this.show.createUser = true;
    this.show.assignRole = false;
    this.editData = userData;
  }

  assignUserRole(userData: any){
    this.show.createUser = false;
    this.show.searchUser = false;
    this.show.assignRole = true;
    this.userId = userData.userId;
  }

  async resetPassword(username: any){
    if (!confirm('Are you sure you want to Change the Password?')) return;
    try {
      const response: any = await this.httpService.resetPassword(username);
      console.log(response)
      if(response.status === 200){
        this.toastService.show('Success', {classname: 'bg-success', delay: 3000});
      }
    } catch (error) {}
  }

}
