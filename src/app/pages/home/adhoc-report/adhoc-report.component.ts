import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StringHelper } from '@helpers/string.helper';
import { AppService } from '@services/app.service';
import { ToastService } from '@services/toast-service';
import { truncate } from 'fs';

@Component({
  selector: 'app-adhoc-report',
  templateUrl: './adhoc-report.component.html',
  styleUrls: ['./adhoc-report.component.scss']
})
export class AdhocReportComponent {
  @ViewChildren('checkBox') columnListEl: QueryList<ElementRef<HTMLInputElement>>;
  
  hideSpinner: boolean = false;
  
  tableData: any[] = [];

  tableList: any[] = [];
  columnList: any[] = [];
  colListS: any[] = [];
  conditionList: any[] = [];

  reportResData: any[] = [];

  reqObj: any ={
    tableName: null,
    columnNames: [],
    conditions: [],
    conditionOperator: null
  }

  conditionObj: any =  {
    column: "",
    operator: "",
    value: "",
    startDate: "",
    endDate: ""
  }

  conditionOperatorList = [
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' }
  ];

  operatorList = [
    { value: '=', label: '= (Equal)' },
    { value: '!=', label: '!= (Not Equal)' },
    { value: '<', label: '< (Less Than)' },
    { value: '<=', label: '<= (Less Than or Equal)' },
    { value: '>', label: '> (Greater Than)' },
    { value: '>=', label: '>= (Greater Than or Equal)' },
    { value: 'BETWEEN', label: 'BETWEEN' },
    { value: 'LIKE', label: 'LIKE' },
    { value: 'NOT LIKE', label: 'NOT LIKE' },
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' },
    { value: 'NOT', label: 'NOT' },
  ];
  
  constructor(private httpService: AppService, private toastService: ToastService, private router: Router) {
    this.columnListEl = new QueryList<ElementRef<HTMLInputElement>>();
  }

  ngOnInit() {
    this.getTableList();
  }

  async getTableList() {
    try {
      const response: any = await this.httpService.getAdhocTableList();
      if (response.status == 200) {
        const tables = response?.data;
        if (tables.length > 0) {
          for (let data of tables) {
            this.tableList.push({
              value: data.tableName,
              label: this.toReadableText(data.tableName)
            });
          }
        }
      }
      
    } catch (error) {}

   
  }

  async loadInterface(tableName: any) {
    try {
      this.colListS = []
      this.conditionList = []
      this.reqObj.columnNames = []
      this.columnList = []
      this.hideSpinner = false;
      const response: any = await this.httpService.getAdhocDataList(tableName);
      this.hideSpinner = true;

      if (response?.data.length) {
        this.tableData = response?.data;
        this.columnList = Object.keys(response?.data[0]);
      } else {
        this.toastService.show('No Data Found', {classname: 'bg-danger', delay: 3000});
      }
      
      if (this.columnList.length) {
        for (let column of this.columnList) {
          this.colListS.push({
            value: column,
            label: this.toReadableText(column)
          });
        }
      }
    } catch (error) {
      this.hideSpinner = true;
      this.toastService.show('Something went wrong', {classname: 'bg-danger', delay: 3000});
    }
  }

  async generateReport() {
    try {
      if (this.reqObj.columnNames.length > 0) {
        this.reqObj.conditions = this.conditionList;
      const response: any = await this.httpService.generateAdhocReport(this.reqObj);
      console.log(response.data);
      this.reportResData = response.data;
      console.log(this.reportResData.length)
      if (this.reportResData.length) {
        const newWindow = window.open(`/report/adhoc-report/${this.reqObj.tableName}`, '_blank');
        newWindow?.addEventListener('load', () => {
          newWindow.postMessage({ data: this.reportResData }, '*');
        });
      }
      } else {
        this.toastService.show('Select Column Name', {classname: 'bg-danger', delay: 3000});
      }
      
    } catch (error) {
      this.toastService.show('Something went wrong', {classname: 'bg-danger', delay: 3000});
    }
  }



  updateColList(el: any, column: any, all:any | undefined = null) {
    const checked = el.target.checked;
    if (all) {
      const checkboxes = this.columnListEl.toArray();
      if (checked) {
        this.reqObj.columnNames = this.columnList;
        checkboxes.forEach(box => {
          box.nativeElement.checked = true;
        })
      } else {
        this.reqObj.columnNames = [];
        checkboxes.forEach(box => {
          box.nativeElement.checked = false;
        })
      }
    } else {
      if (checked) {
        this.reqObj.columnNames.push(column);
      } else {
        this.reqObj.columnNames = this.reqObj.columnNames.filter((item:any) => item !== column);
      }
    }

    // console.log('csdc',this.reqObj.columnNames)
  }


  toggleCondition() {
    if (this.conditionList.length == 0) this.addConditionCount();
    else this.conditionList = [];
  }

  addConditionCount()
  {
    const cloneObject = JSON.parse(JSON.stringify(this.conditionObj));
    this.conditionList.push(cloneObject);
  }



  resetData() {
    this.colListS = [];
    this.columnList = [];
    this.conditionList = [];
    this.reqObj = {
      tableName: null,
      columnNames: [],
      conditions: [],
      conditionOperator: null
    };
  }


  toReadableText(inputString: any) {
    if (inputString.includes('_'))  return this.removeUnderscore(inputString);
    else return this.convertCapToTitleCase(inputString);
    
  }
  convertCapToTitleCase(inputString: string) {
    return StringHelper.convertCapToTitleCase(inputString);
  }
  removeUnderscore(inputString:any) {
    return StringHelper.convertSnakeToTitleCase(inputString);
  }
}
