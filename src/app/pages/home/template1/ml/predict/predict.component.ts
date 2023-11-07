import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppService } from '@services/app.service';
import { ToastService } from "@services/toast-service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss'],
})
export class PredictComponent {
  @Input() fields: any;
  @Input() selectedReport: any;
  @Input() dataList: any[] = [];
  @Input() predictResDataFromCsv: any[] = [];
  // @Input() reportList: any[] = [];
  // @Output() submitEvent: any = new EventEmitter<void>();

  outFields: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
  ) { }

  predictResData: any[] = [];
  inputDataList: any[] = [];
  dataObject: { [key: string]: any } = {};
  vehicleType: string | any;
  year: string | any;
  incidentCity: string | any;
  instituteName: string | any;
  instituteCode: string | any;
  startYear: string | any;
  endYear: string | any;
  showPredictRes: boolean = false;
  allowedReportIds: number[] = [18, 19, 47, 45, 66, 67];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedReport']) {
      this.loadReportDataExample();
    }
    if (this.predictResDataFromCsv.length != 0 && changes['predictResDataFromCsv']) {
      this.predictResData = this.predictResDataFromCsv
      this.outFields = Object.keys(this.predictResData[0]);

      this.showPredictRes = true
    }
  }
  ngOnInit() {
    // this.loadReportDataExample()
  }

  addDataCount() {
    const cloneObject = JSON.parse(JSON.stringify(this.dataObject));
    this.inputDataList.push(cloneObject);
  }

  async submitData() {
    try {
      if (this.allowedReportIds.includes(this.selectedReport.reportId)) {
        let formData: FormData = new FormData();
        let report = '';
        if (this.selectedReport.reportId == 18) {
          report = 'region';
          formData.append('incidentCity', this.incidentCity);
          formData.append('year', this.year);
        }
        if (this.selectedReport.reportId == 19) {
          report = 'vehicle';
          formData.append('vehicleType', this.vehicleType);
          formData.append('year', this.year);
        }
        if (this.selectedReport.reportId == 66 || this.selectedReport.reportId == 67) {
          if (this.selectedReport.reportId == 66) {
            report = 'revenue-forecast';
          } else {
            report = 'expense-forecast';
          }
          formData.append('year', this.year);
        }
        if (this.selectedReport.reportId == 47) {
          report = 'sales-forecasting';
          formData.append('startYear', this.startYear);
          formData.append('endYear', this.endYear);
        }
        if (this.selectedReport.reportId == 45) {
          report = 'trend-analysis';
          formData.append('startDate', this.startYear);
          formData.append('endDate', this.endYear);
        }

        this.spinner.show();
        const response: any = await this.httpService.predict(report, formData);
        this.spinner.hide();
        if (response?.status === 200) {
          debugger
          this.predictResData = [response?.data.response];
          if (this.selectedReport.reportId == 45) {
            this.predictResData[0].outliers = Object.keys(this.predictResData[0].trendOutliers);
          }

          // this.outFields = Object.keys(this.predictResData)
          console.log(response?.data.response)
          this.toastService.show(response.data.message, { classname: 'bg-success', delay: 4000 });
          this.showPredictRes = true;
        } else {
          this.toastService.show(response.data.message, { classname: 'bg-danger', delay: 4000 });
        }
      }
      else {
        this.spinner.show();
        const response: any = await this.httpService.submitDataForPredict(this.inputDataList, this.selectedReport.reportId);
        this.spinner.hide();
        if (response?.status === 200) {
          this.predictResData = response?.data.response;
          this.toastService.show(response.data.message, { classname: 'bg-success', delay: 4000 });
          this.showPredictRes = true;
        } else {
          this.toastService.show('Error', { classname: 'bg-danger', delay: 4000 });
        }
      }
    } catch (e: any) {
      this.spinner.hide();
      // @ts-ignore
      if (e.response.status === 500) {
        this.toastService.show(e.response.data, { classname: 'bg-danger', delay: 4000 });
      } else if (e.response.status === 400) {
        this.toastService.show(e.response.data.message, { classname: 'bg-danger', delay: 4000 });
      } else if (e.response.status === 451) {
        this.toastService.show(e.response.data, { classname: 'bg-danger', delay: 6000 });
      }
      else {
        this.toastService.show(e.response.data.message, { classname: 'bg-danger', delay: 4000 });
      }
    }
  }

  async loadReportDataExample() {
    try {
      this.inputDataList = [];
      // this.tableTitle = this.getLabelByValue(this.selectedReport.reportId);
      this.fields = Object.keys(this.dataList[0]);
      this.fields.forEach((propertyName: string | number) => {
        this.dataObject[propertyName] = null;
      });
      this.addDataCount();
    } catch (e) { }
  }

  // getLabelByValue(value: number): string | undefined {
  //   const item = this.reportList.find((item: { value: number; }) => item.value === value);
  //   return item ? item.label : undefined;
  // }
}
