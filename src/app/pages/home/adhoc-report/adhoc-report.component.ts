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
      // this.resetData();
      this.colListS = []
      this.conditionList = []
      this.reqObj.columnNames = []
      this.hideSpinner = false;
      const response: any = await this.httpService.getAdhocColumnList(tableName);
      this.hideSpinner = true;
      this.columnList = response?.data;
      
      if (this.columnList.length) {
        for (let column of this.columnList) {
          this.colListS.push({
            value: column,
            label: column
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
      this.reqObj.conditions = this.conditionList;
      const response: any = await this.httpService.generateAdhocReport(this.reqObj);
      console.log(response.data);
      this.reportResData = response.data;
      if (this.reportResData.length) {
        // const queryString = `data=${JSON.stringify(this.reportResData)}`;
        const newWindow = window.open(`/report/adhoc-report/${this.reqObj.tableName}`, '_blank');
        newWindow?.addEventListener('load', () => {
          newWindow.postMessage({ data: this.reportResData }, '*');
        });
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
