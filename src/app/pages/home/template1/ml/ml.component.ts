import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppService } from '@services/app.service';
import './reportObject';
import { claimAnalysis } from './reportObject';
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "@services/toast-service";

@Component({
  selector: 'app-ml',
  templateUrl: './ml.component.html',
  styleUrls: ['./ml.component.scss'],
})
export class MLComponent {
  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
  ) {}

  @Input() mlReport: any = {};

  reportList: any[] = [];
  fields: any[] = [];
  dataList: any[] = [];
  inputDataList: any[] = [];
  dataObject: { [key: string]: any } = {};
  csvFile!: File;
  tableTitle: string | undefined;
  activeTab: string = 'Train';
  modelList: any[] = [];
  totalNumberOfData: number = 0;
  predictResDataFromCsv: any[] = [];

  currentPage: number = 1;

  oldReportId: any;
  isLoading: boolean = false;

  ngDoCheck() {
    if (this.mlReport.reportId != this.oldReportId) {
      this.loadReportDetails(this.mlReport.reportId, this.currentPage);
      this.loadModelDetails(this.mlReport.reportId);
      this.oldReportId = this.mlReport.reportId;
    }
  }

  ngOnInit() {
    // await this.loadReportList();
  }

  async loadReportDetails(id: any, pageNo: any) {
    this.inputDataList = [];

    const response: any = await this.httpService.loadReportData(id, pageNo);
    if (response?.status === 200) {
      this.dataList = response?.data.analysisValue;
      this.totalNumberOfData = response?.data.totalCountAnalysisValue
      this.fields = Object.keys(this.dataList[0]);

      this.fields.forEach((propertyName) => {
        this.dataObject[propertyName] = null;
      });
      this.addDataCount();
    }
  }

  async loadPaginationData( pageNo: any) {
    const response: any = await this.httpService.loadReportData(this.mlReport.reportId, pageNo);
    this.dataList = response?.data.analysisValue;

    
  }

  async loadModelDetails(id: any) {
    try {
      const response: any = await this.httpService.loadModelDetails(id);
      if (response?.status === 200) {
        this.modelList = response?.data;
      }
    }catch (err){}
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.name.endsWith('.csv')) {
        console.log('Selected CSV file:', selectedFile);
        this.csvFile = selectedFile;
      } else {
        alert('Please select a valid CSV file.');
      }
    }
  }

  // ADD TO DATASET
  addDataCount() {
    const cloneObject = JSON.parse(JSON.stringify(this.dataObject));
    this.inputDataList.push(cloneObject);
    // this.getDataObject(this.selectedReport.reportId);
  }

  async pushCsvFile() {
    try {
      if(this.activeTab === 'Train'){
        this.spinner.show();
        const response: any = await this.httpService.pushCsvFileForTrain(this.csvFile, this.mlReport.reportId);
        this.spinner.hide();
        if (response?.status === 200) {
          this.toastService.show(response.data.message, {classname: 'bg-success', delay: 4000});
        }else{
          this.toastService.show(response.data.message, {classname: 'bg-danger', delay: 4000});
        }
      }
      else if(this.activeTab === 'Predict'){
        this.spinner.show();
        const response: any = await this.httpService.pushCsvFileForPredict(this.csvFile, this.mlReport.reportId);
        this.spinner.hide();
        console.log(response)
        if (response?.status === 200) {
          this.predictResDataFromCsv = response.data.response
          this.toastService.show(response.data.message, {classname: 'bg-success', delay: 4000});
        }else{
          this.toastService.show(response.data.message, {classname: 'bg-danger', delay: 4000});
        }
      }
    } catch (e) {
      this.spinner.hide();
      // @ts-ignore
      if(e.response.status != 500){
        // @ts-ignore
        this.toastService.show(e.response.data.message, {classname: 'bg-danger', delay: 4000});
      }else{
        // @ts-ignore
        this.toastService.show(e.response.data, {classname: 'bg-danger', delay: 4000});
      }
    }
  }

  async submitData() {
    // this.spinner.show();
    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 5000);
    try {
      this.spinner.show();
      const response: any = await this.httpService.submitDataForTrain(this.inputDataList, this.mlReport.reportId);
      this.spinner.hide();
      if (response?.status === 200) {
        this.toastService.show(response.data.message, {classname: 'bg-success', delay: 4000});
      }else{
        this.toastService.show(response.data.message, {classname: 'bg-danger', delay: 4000});
      }
    } catch (e) {
      this.spinner.hide();
      // @ts-ignore
      if(e.response.status != 500){
        // @ts-ignore
        this.toastService.show(e.response.data.message, {classname: 'bg-danger', delay: 4000});
      }else{
        // @ts-ignore
        this.toastService.show(e.response.data, {classname: 'bg-danger', delay: 4000});
      }
    }
  }

  getLabelByValue(value: number): string | undefined {
    const item = this.reportList.find((item) => item.value === value);
    return item ? item.label : undefined;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
