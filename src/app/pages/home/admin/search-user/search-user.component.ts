import { Component, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '@services/app.service';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent {

  @Output() createEvent = new EventEmitter<{ create: boolean; search: boolean; table: boolean }>();
  @Output() searchUserEvent = new EventEmitter<any>();

  form: FormGroup | undefined;



  formData : any = {

      index:null,
      username:null,
      userTypeId:"1",
      empolyeeName:null,
      department:null,
      designation:null,
      email:null,
      isActive:"Y",
      
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
  searchItemValue: string = '';
  tableSizes: any = [10, 20, 30, 50];
  pageSize: number = this.tableSizes[0];
  currentPage: number = 1;
  searchUserList: any[] = [];
  paginationList: any[] = [];
  showSearchUserList: any[] = [];
  userTypes: any = ["Internal", "External"];
  userType: any = "Internal"
  userStatusAll: any = ["Active", "Inactive"];
  userStatus: any = "";
  userName: any = "";
  department: any = "";
  tempSearchUserList: any[] = [];
  update: boolean = false;
  submitBtnText: string = 'Save';
  showCreateUser: boolean= false;




  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService,
  ) {}

  ngAfterViewInit() {}
  onSubmit() {}


  ngOnInit() {
    this.currentPage = 1;
  }


  async loadSearchUserList() {
    let data = {
      userType: this.userType === "Internal" ? 1 : 2,
      isActive: "",
      username: this.userName,
      // department: this.department
    }
    if(this.userStatus === "Active"){data.isActive = "Y"}
    else if(this.userStatus === "Inactive"){data.isActive = "N"}

    this.searchUserEvent.emit(data);
    // try {
    //   let data = {
    //     userType: this.userType === "Internal" ? 1 : 2,
    //     isActive: "",
    //     username: this.userName,
    //     // department: this.department
    //   }
    //   if(this.userStatus === "Active"){data.isActive = "Y"}
    //   else if(this.userStatus === "Inactive"){data.isActive = "N"}
    //   const response: any = await this.httpService.loadSearchUserList(data);
    //   console.log(response.data);
    //   if(response.status){
    //     this.searchUserList = response.data
    //     this.tempSearchUserList = this.searchUserList;
    //     this.paginationList = this.splitArray(this.searchUserList, this.pageSize);
    //     this.showSearchUserList = this.paginationList[this.currentPage - 1];
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
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
    // console.log(this.pageSize);
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


  refreshPage() {
    window.location.reload();
  }

  onReset(){
    this.userType = "Internal"
    this.userName = null
    this.userStatus = null
    this.department = null
  }

 
  
  onSearchClick() {
    this.createEvent.emit({ create: true, search: false, table: false });
  }


}
