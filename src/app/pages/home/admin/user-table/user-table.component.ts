import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AppService } from '@services/app.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent {
  @Input() userList: any;
  @Output() unassignEvent = new EventEmitter<any>();

  fields: any = [
    { key: 'index', label: 'SL' },
    { key: 'empolyeeName', label: 'Employee Name' },
    { key: 'department', label: 'Department Name', sortable: true },
    { key: 'designation', label: 'Designation' },
    { key: 'userName', label: 'User ID', sortable: true },
  ];

  tableSizes: any = [10, 20, 30, 50];
  pageSize: number = this.tableSizes[0];
  currentPage: number = 1;
  paginationList: any[] = [];
  searchUserList: any[] = [];
  showSearchUserList: any[] = [];
  tempSearchUserList: any[] = [];
  searchItemValue: string = '';

  constructor(private httpService: AppService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userList']) this.showSearchUserList = this.userList;
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
    this.paginationList = this.splitArray(this.userList, this.pageSize);
    this.showSearchUserList = this.paginationList[this.currentPage - 1];
  }
  searchItem() {
    this.showSearchUserList = this.userList;

    if (this.searchItemValue.trim()) {
      this.showSearchUserList = this.showSearchUserList
        .filter((row) => {
          return Object.values(row).some((value) => {
            if (value != null && typeof value === 'string') {
              const searchWords = value.toLowerCase().split(' ');
              return searchWords.some((searchWord) => {
                return searchWord.startsWith(
                  this.searchItemValue.toLowerCase()
                );
              });
            }
            return false;
          });
        })
        .slice(0, this.pageSize);
    } else {
      this.onChangePageSize();
    }
  }

  // public async unassignUser(userId:any) {
  //   const res = await this.httpService.unassignUserRole(userId, userId);
  //   if (res) {
  //     alert("user unassigned");
  //   }
  // }
}
