import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppService } from '@services/app.service';
import {ToastService} from "@services/toast-service";

@Component({
  selector: 'app-reports-registry',
  templateUrl: './reports-registry.component.html',
  styleUrls: ['./reports-registry.component.scss'],
})
export class ReportsRegistryComponent {
  formData: any = {
    reportName: null,
    reportXdoPath: null,
    reportRtfPath: null,
    reportId: null,
    reportType: 'M',
    parentModuleId: null,
    reportParams: []
  };

  edit: boolean = false;

  searchReport = '';
  tempReportList: any[] = [];
  tableSizes: any = [10, 20, 50, 100];
  pageSize: number = this.tableSizes[0];
  currentPage: number = 1;
  paginationList: any[] = [];
  showReportList: any[] = [];
  subModuleList: any[] = [];

  reportList: any[] = [];
  fields: any = [
    { key: 'index', label: 'SL' },
    { key: 'reportName', label: 'REPORT NAME' },
    { key: 'reportXdoPath', label: 'REPORT XDO PATH' },
    { key: 'reportRtfPath', label: 'REPORT RTF PATH' }
  ];


  paramObject: any = {
    paramName: null,
    paramLabel: null,
    defaultValue: null,
    dataType: null,
    requiredYn: false
  }

  typeList: any[] = [{value: 'text', label: 'text'}, {value: 'date', label: 'date'}]
  paramList: any[] = []

  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.paramList = [];
    this.parentModuleList();
    this.loadReportList().then((r) => {
      // this.addParamCount()
    });
  }

  async parentModuleList() {
    try {
      const response: any = await this.httpService.getSubMenuList();
      let submenuList = response?.data;
      if (submenuList.length > 0) {
        const filteredList = submenuList.filter((item: any) => ![3].some(value => value === item.menuId));

        for (let data of filteredList) {
          this.subModuleList.push({
            value: data.submenuId,
            label: data.submenuName,
          });
        }
      }

    } catch (error) {

    }

  }

  async loadReportList() {
    try {
      const response: any = await this.httpService.getReportList();
      if (response?.status === 200) {
        this.reportList = response.data;
        this.tempReportList = this.reportList;
        this.paginationList = this.splitArray(this.reportList, this.pageSize);
        this.showReportList = this.paginationList[this.currentPage - 1];
      }
    } catch (e) {}
  }

  async onSubmit() {
    try {
      this.paramList.length > 0 ? this.setParamRequiredValue(this.paramList, '') : null;
      this.formData.reportParams = this.paramList;

      if (!this.formData.$invalid) {
        if (!this.edit) {
          const response: any = await this.httpService.saveReport(this.formData);
          if (response.status === 200) {
            this.toastService.show(response.data.message, {classname: 'bg-success', delay: 3000});
          }else{
            this.toastService.show("Error", {classname: 'bg-danger', delay: 3000});
          }
        } else {
          const response: any = await this.httpService.updateReport(this.formData);
          if (response.status === 200) {
            this.toastService.show(response.data.message, {classname: 'bg-success', delay: 3000});
          }else{
            this.toastService.show("Error", {classname: 'bg-danger', delay: 3000});
          }
          this.edit = false;
        }
        this.onReset();
        this.loadReportList();
      }
    } catch (e: any) {}
  }

  setParamRequiredValue(list: any, toType:any) {
    if (toType == 'boolean') {
      list.map((item:any) => item.requiredYn = item.requiredYn=='Y' ? true : false)
    } else {
      list.map((item:any) => item.requiredYn = item.requiredYn ? 'Y' : 'N')
    }

  }

  async deleteReport(reportId: any) {
    try {
      let data: any = {
        reportId: reportId
      }
      const response: any = await this.httpService.deleteReport(data);
      if (response.status === 200) {
        this.toastService.show(response.data.message, {classname: 'bg-success', delay: 3000});
        this.loadReportList()
      }
    }catch (e){}
  }

  enableEdit(data: any) {
    this.edit = true;
    this.formData.reportName = data.reportName;
    this.formData.reportXdoPath = data.reportXdoPath;
    this.formData.reportRtfPath = data.reportRtfPath;
    this.formData.reportId = data.reportId;
    this.formData.reportType = data.reportType;
    this.formData.parentModuleId = parseInt(data.parentModuleId);
    // this.formData.reportParams = data.reportParams;
    this.paramList = data.reportParams;
    this.setParamRequiredValue(this.paramList, 'boolean');
  }

  refreshPage() {
    window.location.reload();
  }

  onChangePage(selectedPage: any) {
    this.currentPage = selectedPage;
    this.showReportList = this.paginationList[this.currentPage - 1];
  }
  onChangePageSize() {
    this.paginationList = this.splitArray(this.reportList, this.pageSize);
    this.showReportList = this.paginationList[this.currentPage - 1];
  }

  splitArray(array: any[], size: any) {
    let result = [];
    for (let i = 0; i < array.length; i += size) {
      let chunk = array.slice(i, i + size);
      result.push(chunk);
    }
    return result;
  }

  searchReports() {
    this.showReportList = this.tempReportList;

    if (this.searchReport.trim()) {
      this.showReportList = this.showReportList
        .filter((row) => {
          if (row.reportName != null) {
            const searchWords = row.reportName.toLowerCase().split(' ');
            return searchWords.some((searchWord: any) => {
              return searchWord
                .toLowerCase()
                .startsWith(this.searchReport.toLowerCase());
            });
          }
        })
        .slice(0, this.pageSize);
    } else {
      this.onChangePageSize();
    }
  }

  onReset() {
    this.edit = false;
    this.formData = {
      reportName: null,
      reportXdoPath: null,
      reportRtfPath: null,
      reportId: null,
      reportType: 'M'
    };
    this.paramList = []
  }

  toggleParam()
  {
    if (this.paramList.length == 0) this.addParamCount();
    else this.paramList = [];
  }


  addParamCount()
  {
      const cloneObject = JSON.parse(JSON.stringify(this.paramObject));
      this.paramList.push(cloneObject);
  }

  async deleteParameter(param: any, i: any){
    try{
      param.reportId = this.formData.reportId
      if(param.requiredYn){param.requiredYn = 'Y'}
      else{param.requiredYn = 'N'}
      const response = await this.httpService.deleteParameter(param);
      if(response.status === 200){
        this.paramList.splice(i, 1);
      }
    }catch (err){}
  }
}
