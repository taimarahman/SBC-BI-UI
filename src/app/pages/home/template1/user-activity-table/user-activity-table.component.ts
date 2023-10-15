import {Component, Input} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AppService} from "@services/app.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-activity-table',
  templateUrl: './user-activity-table.component.html',
  styleUrls: ['./user-activity-table.component.scss']
})
export class UserActivityTableComponent {
  showTable: boolean = false;

  searchItemValue: string = '';
  tableSizes: any = [10, 20, 50, 100];
  pageSize: number = this.tableSizes[0];
  currentPage: number = 1;
  userList: any[] = [];
  paginationList: any[] = [];
  showUserList: any[] = [];
  tempUserList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllUserActivityList();
  }

  showUserLog(userName: any) {
    this.httpService.setpassUserData(userName);
    this.router.navigate(['/activity-log-admin']);
  }

  async getAllUserActivityList() {
    try {
      const response: any = await this.httpService.getAllUserActivityList();
      if (response?.status === 200) {
        this.userList = response.data
        this.tempUserList = this.userList;
        this.paginationList = this.splitArray(this.userList, this.pageSize);
        this.showUserList = this.paginationList[this.currentPage - 1];
        this.showTable = true;
      }
    } catch (error: any) {
      // console.log(error.response.data)
    }
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
    this.showUserList = this.paginationList[this.currentPage - 1];
  }

  onChangePageSize() {
    this.paginationList = this.splitArray(this.userList, this.pageSize);
    this.showUserList = this.paginationList[this.currentPage - 1];
  }

  // searchItem() {
  //   this.showUserList = this.tempUserList;
  //
  //   if (this.searchItemValue.trim()) {
  //     this.showUserList = this.showUserList
  //       .filter((row) => {
  //         if (row.menuName != null) {
  //           const searchWords = row.menuName?.toLowerCase().split(' ');
  //           return searchWords.some((searchWord: any) => {
  //             return searchWord
  //               .toLowerCase()
  //               .startsWith(this.searchItemValue.toLowerCase());
  //           });
  //         }
  //       })
  //       .slice(0, this.pageSize);
  //   } else {
  //     this.onChangePageSize();
  //   }
  // }

  searchItem() {
    this.showUserList = this.userList;

    if (this.searchItemValue.trim()) {
      this.showUserList = this.showUserList.filter(row => {
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

}
