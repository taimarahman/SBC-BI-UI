import { ChangeDetectorRef, Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { StringHelper } from '@helpers/string.helper';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '@services/app.service';
import { ToastService } from '@services/toast-service';

@Component({
  selector: 'app-adhoc-report',
  templateUrl: './adhoc-report.component.html',
  styleUrls: ['./adhoc-report.component.scss']
})
export class AdhocReportComponent {
  @ViewChildren('checkBox') columnListEl!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('dcheck') ddCheckBox!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('dropdownRef') dropdowns!: QueryList<NgbDropdown>;
  @ViewChild('editField') editField!: ElementRef;

  rotateIcon: boolean = false;
  hideSpinner: boolean = false;
  loadIntf: boolean = false;
  filterYN: boolean = false;
  renameYN: boolean = false;
  conditionYN: boolean = false;
  
  tableData: any[] = [];

  tableList: any[] = [];
  columnList: any[] = [];
  colListS: any[] = [];
  conditionList: any[] = [];
  dateRangeList: any[] = [];
  uniqueDataset: any = {};
  filterTrackList: { [key: string]: any } = {};
  fieldList: any[] = [];
  editing: boolean[] = [];

  reportResData: any[] = [];

  reqObj: any ={
    tableName: null,
    columnNames: [],
    conditions: [],
    conditionOperator: null
  }

  date = {
    start: {
      year: 0,
      month: 0,
      day: 0,
    },
    end: {
      year: 0,
      month: 0,
      day: 0,
    },
  };

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
  
  constructor(private httpService: AppService, private toastService: ToastService, private cdr: ChangeDetectorRef) {
    // this.columnListEl = new QueryList<ElementRef<HTMLInputElement>>();
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
      this.colListS = [];
      this.conditionList = [];
      this.reqObj.columnNames = [];
      this.columnList = [];
      this.uniqueDataset = [];
      this.reportResData = [];
      this.hideSpinner = false;
      const response: any = await this.httpService.getAdhocDataList(tableName);
      this.hideSpinner = true;

      if (response?.data.length) {
        this.tableData = response?.data;
        this.reportResData = this.tableData;
        this.columnList = Object.keys(response?.data[0]);
        this.generateFilterringLists(this.tableData, this.columnList);
        this.generateFieldList(this.columnList);
        if (this.columnList.length) {
          for (let column of this.columnList) {
            this.reqObj.columnNames.push(column);
            this.colListS.push({
              value: column,
              label: this.toReadableText(column)
            });
          }
          this.loadIntf = true;
          console.log("checkalll")
          this.checkAll();
        }
      } else {
        this.toastService.show('No Data Found', {classname: 'bg-danger', delay: 3000});
      }
    } catch (error) {
      this.hideSpinner = true;
      this.toastService.show('Something went wrong', {classname: 'bg-danger', delay: 3000});
    }
  }

  checkAll() {
    setTimeout(() => {
      const checkboxes = this.columnListEl.toArray();
      checkboxes.forEach(box => {
        box.nativeElement.checked = true;
     })
    }, 100)
  }

  generateFilterringLists(tableData: any, keyList: any) {
    for (let key of keyList) {
      this.uniqueDataset[key] = Array.from(new Set(tableData.map((item: any) => String(item[key])))).sort();
      // SORT LIST FOR BETTER READABILITY
      this.uniqueDataset[key].sort((a:any, b:any) => {
        const numA = Number(a);
        const numB = Number(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        } else {
          return a.localeCompare(b); // If one or both values cannot be converted to numbers,sort them as strings
        }
      });
    }
    this.filterTrackList = { ...this.uniqueDataset };

  }

  doFilter(key: any) {
    const elList = document.getElementById(`div-${key}`)?.querySelectorAll('input');
    // if (!this.filterTrackList[key]) this.filterTrackList[key] = [];
    let reFilter: Boolean = false;
    // console.log(key, elList);
    if (elList?.length) {
      elList.forEach(el => {
        if (el.checked && !this.filterTrackList[key].includes(el.value)) {
          this.filterTrackList[key].push(el.value);
          reFilter = true;
        }
        if (!el.checked && this.filterTrackList[key].includes(el.value)) {
          this.filterTrackList[key] = this.filterTrackList[key].filter((item: any) => item != el.value);
          reFilter = true;
        }
      })
    }
    if (reFilter) { //filterValueList.length && Object.keys(this.filterTrackList).length
          this.reportResData = this.tableData.filter(item => {
            return Object.keys(this.filterTrackList).every(key => {
              const itemValue = String(item[key]);
              const filterValues = this.filterTrackList[key];
              console.log(filterValues)
              return filterValues.length==0 || filterValues.some((value:any) => itemValue.includes(value));
            });
          });
    }

    const index = this.reqObj.columnNames.indexOf(key);
    console.log(this.reqObj.columnNames,"sdcs", this.dropdowns.toArray()[index], index)
    this.dropdowns.toArray()[index].close(); //CLOSE DROPDOWN

    this.generateFilterringLists(this.reportResData, this.columnList); //GENERATE NEW FILTERING LIST
  }

  async generateReport() {
    try {
      if (this.reqObj.columnNames.length > 0 && this.reportResData.length > 0) {
        console.log(this.reportResData)
        // ONLY SELECTED COLUMNS
        const filteredData = this.reportResData.map(obj => {
          const newObj: { [key: string]: any } = {};
          this.reqObj.columnNames.forEach((prop:any) => {
            if (obj.hasOwnProperty(prop)) {
              newObj[prop] = obj[prop];
            }
          });
          return newObj;
        });

        const dataToTransfer: any = {
          data: filteredData,
          fieldset: this.fieldList
        } 
        localStorage.setItem('sharedData', JSON.stringify(dataToTransfer));
        const newWindow = window.open(`/report/adhoc-report/${this.reqObj.tableName}`, '_blank');
      } else {
        this.toastService.show('No data to show', {classname: 'bg-danger', delay: 3000});
      }
      
    } catch (error) {
      this.toastService.show('Something went wrong', {classname: 'bg-danger', delay: 3000});
    }
  }

  async getConditionalData() {
    try {
      if (this.reqObj.columnNames.length > 0) {
        this.reqObj.conditions = this.conditionList;
        const response: any = await this.httpService.generateAdhocReport(this.reqObj);
        if (response?.data.length) {
          this.tableData = response.data;
          this.reportResData = this.tableData;
          this.resetFilter();
        } else {
          this.toastService.show('No Data Found', {classname: 'bg-danger', delay: 3000});
        }
      } else {
        this.toastService.show('Select Column Name', {classname: 'bg-danger', delay: 3000});
      }
    } catch (error) {
      
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

  }


  toggleCondition() {
    if (this.conditionList.length == 0) this.addConditionCount();
    else {
      this.conditionList = [];
      this.dateRangeList = [];
    }
  }

  addConditionCount(){
    const cloneObject = JSON.parse(JSON.stringify(this.conditionObj));
    this.conditionList.push(cloneObject);
    const dateObject = JSON.parse(JSON.stringify(this.date));
    this.dateRangeList.push(dateObject);
  }

  assignDateToVar(date: any, obj: any, flag:any) {
    if(flag=='start') obj.startDate = this.formatDate(date);
    else obj.endDate = this.formatDate(date);
  }


  resetFilter() {
    this.reportResData = this.tableData;
    this.reqObj.columnNames = this.columnList;
    // RESET FILTER TRACK
    this.filterTrackList = { ...this.uniqueDataset };
    this.generateFilterringLists(this.tableData, this.columnList);
    // FOR COLUMN LIST CHECK ALL 
    this.checkAll();
    // FOR DROPDOWN LIST UNCHECK ALL 
    this.ddCheckBox.toArray().forEach(dropdown => dropdown.nativeElement.checked = false);

    // FOR SPIN ICON ON REFRESH
    this.rotateIcon = true;
    setTimeout(() => {
      this.rotateIcon = false;
    }, 500);
  }

  generateFieldList(keyList:any) {
    this.fieldList = keyList.map((key: any) => {
      return {
        key: key,
        label: this.toReadableText(key)
      };
    });
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

// FOR RENAMING
  renameColumn(index: number) {
    this.editing[index] = true;
    setTimeout(() => {
      this.editField.nativeElement.focus();
    });
  }
  
  stopEditing(index: number) {
    this.editing[index] = false;
  }

  formatDate(date: any) {
    return StringHelper.formatDateYYYYMMDD(date);
  }

  toReadableText(inputString: any) {
    if (typeof inputString === 'string' && inputString.includes('_'))  return this.removeUnderscore(inputString);
    else return this.convertCapToTitleCase(inputString);
    
  }
  convertCapToTitleCase(inputString: string) {
    return StringHelper.convertCapToTitleCase(inputString);
  }
  removeUnderscore(inputString:any) {
    return StringHelper.convertSnakeToTitleCase(inputString);
  }

// SCROLL TO ELEMENT
  scroll(el: HTMLElement) {
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth' });   
    }, 100)
  }


}


