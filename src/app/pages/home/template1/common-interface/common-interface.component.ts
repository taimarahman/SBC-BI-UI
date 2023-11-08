import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '@services/app.service';

@Component({
  selector: 'app-common-interface',
  templateUrl: './common-interface.component.html',
  styleUrls: ['./common-interface.component.scss']
})
export class CommonInterfaceComponent {

  public pathValueMap = {
    'claim': '1',
    'operations': '2',
    'financial': '3',
    'claim-analytics': '12',
    'actuarial-analytics': '13',
    'sales-investigation': '14',
    // 'revenue': '15',
    'insurance-underwriting': '16',
    'insurance-finance': '17',
    'cash-flow-management': '18',
    'accident-analysis': '19',
    'fraudulent-activity-analysis': '20',
    'ranking-report': '21',
    'interactive-report': '22',
    'operational-report': '23',
    // 'ad-hoc-report': '24',
    // 'caramel-dashboard': '27',
    'insurance-operation': '27',
    // 'centralized-reports': '31',
    'marketing': '15',
    'revenue-analysis': '28'
  };

  reportList: any[] = [];
  selectedReport: any = {
    reportId: null,
    reportName: null,
    reportParam: []
  };
  currentRoute: any;
  pathId: any;
  selectedReportType: any;
  viewPermission: boolean = false;


  constructor(private httpService: AppService, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.currentRoute = this.currentRoute.replace(/-/g, ' ')
    this.currentRoute = this.route.snapshot.routeConfig?.path?.split('/').pop();
    // @ts-ignore
    this.pathId = this.pathValueMap[this.currentRoute];
    if (this.currentRoute.includes('-report')) {
      this.currentRoute = this.currentRoute.replace(/-report/g, ' ');
    } else {
      this.currentRoute = this.currentRoute.replace(/-/g, ' ');
    }
    this.getIdWiseReportList(this.pathId);
  }


  async getIdWiseReportList(id: any) {
    const response: any = await this.httpService.getIdWiseReportList(id);
    const reports = response?.data;
    if (reports.length > 0) {
      for (let data of reports) {
        this.reportList.push({
          value: data.reportId,
          label: data.reportName,
          type: data.reportType,
          param: data.reportParams
        });
      }
    }
  }

  loadInterface(reportId: any) {
    const currentReport = this.reportList.find(
      (item) => item.value === reportId
    );
    this.selectedReport.reportName = currentReport.label;
    this.selectedReport.reportParam = currentReport.param;
    this.selectedReportType = currentReport.type;
    console.log(this.selectedReport)
    if (this.selectedReportType === 'M') {
      this.trainActivityPermission();
    }
  }

  async trainActivityPermission() {
    try {
      const response = await this.httpService.trainActivityPermission();
      if (response.status === 200) {
        this.viewPermission = response.data
      }
    } catch (err) { }
  }

}
