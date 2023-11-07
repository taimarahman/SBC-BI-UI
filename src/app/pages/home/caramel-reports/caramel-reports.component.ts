import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '@services/app.service';
import { barChart } from './chartObjectsCR';
import { ToastService } from '@services/toast-service';

@Component({
  selector: 'app-caramel-reports',
  templateUrl: './caramel-reports.component.html',
  styleUrls: ['./caramel-reports.component.scss']
})
export class CaramelReportsComponent {

  hideSpinner: boolean = false;

  reportList: any[] = [];
  selectedReportDetails: any[] = [];
  fields: any[] = [];
  selectedReport: any = {
    reportId: null,
    reportName: null
  };

  reportURL: string = 'http://192.168.78.13:8084/api/v1/reports/IDRA/Caramel/';

  seriesObj = {
    name: '',
    data: []
  }
  reportBarChart: any;

  constructor(private httpService: AppService, private route: ActivatedRoute, private toastService: ToastService,) {

  }

  ngOnInit() {
    this.getIdWiseReportList();
  }


  async getIdWiseReportList() {

    const response: any = await this.httpService.getIdWiseReportList('29'); // 29 for caramel report
    const reports = response?.data;
    if (reports.length > 0) {
      for (let data of reports) {
        this.reportList.push({
          value: data.reportId,
          label: data.reportName
        });
      }
    }
  }

  async loadInterface(reportId: any) {
    this.hideSpinner = false;
    const currentReport = this.reportList.find(
      (item) => item.value === reportId
    );
    this.selectedReport.reportName = currentReport.label;
    const response: any = await this.httpService.getCaramelReportData(reportId);
    this.hideSpinner = true;

    this.selectedReportDetails = response?.data;
    if (this.selectedReportDetails) {
      this.getTableData();
      this.getChartData();
    }
  }

  getTableData() {
    if (this.selectedReportDetails) {
      this.fields = Object.keys(this.selectedReportDetails[0]);
      this.fields = this.fields.filter((item) => item != 'companyName');
      console.log(this.fields);
    }
  }

  getChartData() {
    if (this.selectedReportDetails) {
      this.reportBarChart = JSON.parse(JSON.stringify(barChart));
      this.reportBarChart.title.text = this.selectedReport.reportName;
      const NAlist = ['companyName', 'riskStatus', 'riskType']
      const filteredList = this.fields.filter((item) => !NAlist.includes(item));

      this.selectedReportDetails.map(item => {
        this.reportBarChart.labels.push(item.companyName)
      });

      filteredList.map(prop => {
        let currentObj = JSON.parse(JSON.stringify(this.seriesObj));
        currentObj.name = this.convertToTitleCase(prop);

        this.selectedReportDetails.map(item => {
          if (this.reportBarChart.labels.length != this.selectedReportDetails.length) this.reportBarChart.labels.push(item.companyName)
          currentObj.data.push(item[prop]);
        });
        this.reportBarChart.series.push(currentObj);
      })

    }

  }


  async openReport(report: any, reportId: any) {
    report = report.charAt(0).toUpperCase() + report.slice(1);
    try {
      const response: any = await this.httpService.printCaramelsReport(report, reportId);
      if (response?.status === 200) {
        const url: string = response.data + '/PDF'
        window.open(url, "_blank")
      }
    } catch (e:any) {
      this.toastService.show(e.response.data, {classname: 'bg-danger', delay: 4000});
     
    }

  }


  convertToTitleCase(inputString: string): string {
    const words = inputString.split(/(?=[A-Z])/); // Split by capital letters
    const titleCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return titleCaseWords;
  }
}
