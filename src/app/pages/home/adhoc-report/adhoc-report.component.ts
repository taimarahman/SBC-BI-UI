import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '@services/app.service';
import { ToastService } from '@services/toast-service';

@Component({
  selector: 'app-adhoc-report',
  templateUrl: './adhoc-report.component.html',
  styleUrls: ['./adhoc-report.component.scss']
})
export class AdhocReportComponent {
  hideSpinner: boolean = false;

  tableList: any[] = [];
  tableId: any;

  constructor(private httpService: AppService, private toastService: ToastService,) {}

  ngOnInit() {
    this.getIdWiseTableList();
  }


  async getIdWiseTableList() {

    const response: any = await this.httpService.getAdhocTableList();
    const tables = response?.data;
    console.log(tables);
    if (tables.length > 0) {
      for (let data of tables) {
        this.tableList.push({
          value: data.tableName,
          label: data.tableName
        });
      }
    }
  }

  async loadInterface(reportId: any) {
    this.hideSpinner = false;
    const currentReport = this.tableList.find(
      (item) => item.value === reportId
    );
  
  }
}
