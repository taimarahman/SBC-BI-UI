import { Component } from '@angular/core';
import {ChartData, ChartType} from "chart.js/dist/types";
import {FormBuilder} from "@angular/forms";
import {AppService} from "@services/app.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-interactive-dashboard',
  templateUrl: './interactive-dashboard.component.html',
  styleUrls: ['./interactive-dashboard.component.scss']
})
export class InteractiveDashboardComponent {

  fromDate: any;
  toDate: any;

  formData = {
    dateRangeStart: {
      year: 0,
      month: 0,
      day: 0,
    },
    dateRangeEnd: {
      year: 0,
      month: 0,
      day: 0,
    },
  };



  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService,
    private router: Router
  ) { }

  showPieChart: boolean = false
  showBarChart: boolean = false
  showDoughnutChart: boolean = false

  ngOnInit() {    
  }


  // async loadClaimAnalysisData() {
  //   try {
  //     this.formData.dateRangeStart = this.formDataRes.dateRangeStart
  //     this.formData.dateRangeEnd = this.formDataRes.dateRangeEnd

  //     const currentYear = new Date().getFullYear();

  //     const jsDateStart = new Date(currentYear, 6, 1);
  //     const jsDateEnd = new Date(currentYear + 1, 5, 30);


  //     this.formDataRes.dateRangeStart.year = currentYear
  //     this.formDataRes.dateRangeStart.month = 7
  //     this.formDataRes.dateRangeStart.day = 1

  //     this.formDataRes.dateRangeEnd.year = currentYear + 1
  //     this.formDataRes.dateRangeEnd.month = 6
  //     this.formDataRes.dateRangeEnd.day = 30

  //     // @ts-ignore
  //     this.formData.dateRangeStart = `${jsDateStart.getDate().toString().padStart(2, '0')}-${(
  //       jsDateStart.getMonth() + 1
  //     )
  //       .toString()
  //       .padStart(2, '0')}-${jsDateStart.getFullYear()}`;

  //     // @ts-ignore
  //     this.formData.dateRangeEnd = `${jsDateEnd.getDate().toString().padStart(2, '0')}-${(
  //       jsDateEnd.getMonth() + 1
  //     )
  //       .toString()
  //       .padStart(2, '0')}-${jsDateEnd.getFullYear()}`;


  //     const response: any = await this.httpService.loadClaimAnalysisData(this.formData.dateRangeStart, this.formData.dateRangeEnd);
  //     if (response?.status === 200) {
  //       this.pieChartData.labels = []
  //       this.pieChartData.datasets[0].data = []

  //       this.barChartData.labels = []
  //       this.barChartData.datasets[0].data = []

  //       this.doughnutChartData.labels = []
  //       this.doughnutChartData.datasets[0].data = []

  //       let idx = 0
  //       while (1) {
  //         if (idx >= response.data.length) { break; }
  //         this.pieChartData.labels.push(response.data[idx].locationArea)
  //         this.pieChartData.datasets[0].data.push(response.data[idx].claimNumber)

  //         this.barChartData.labels.push(response.data[idx].locationArea)
  //         this.barChartData.datasets[0].data.push(response.data[idx].claimNumber)

  //         this.doughnutChartData.labels.push(response.data[idx].locationArea)
  //         this.doughnutChartData.datasets[0].data.push(response.data[idx].claimNumber)
  //         idx++
  //       }
  //     }
  //   } catch (e) { }
  // }


  async onSubmit() {
  //   this.showPieChart = false
  //   this.showBarChart = false
    //   this.showDoughnutChart = false

    this.fromDate = this.formatDate(this.formData.dateRangeStart)
    this.toDate = this.formatDate(this.formData.dateRangeEnd)
    console.log(this.fromDate);

  //   this.formData.dateRangeEnd = this.formDataRes.dateRangeEnd

  //   const jsDateStart = new Date(
  //     this.formData.dateRangeStart.year,
  //     this.formData.dateRangeStart.month - 1,
  //     this.formData.dateRangeStart.day
  //   );
  //   const jsDateEnd = new Date(
  //     this.formData.dateRangeEnd.year,
  //     this.formData.dateRangeEnd.month - 1,
  //     this.formData.dateRangeEnd.day
  //   );

  //   // @ts-ignore
  //   this.formData.dateRangeStart = `${jsDateStart.getDate().toString().padStart(2, '0')}-${(
  //     jsDateStart.getMonth() + 1
  //   )
  //     .toString()
  //     .padStart(2, '0')}-${jsDateStart.getFullYear()}`;

  //   // @ts-ignore
  //   this.formData.dateRangeEnd = `${jsDateEnd.getDate().toString().padStart(2, '0')}-${(
  //     jsDateEnd.getMonth() + 1
  //   )
  //     .toString()
  //     .padStart(2, '0')}-${jsDateEnd.getFullYear()}`;


  //   try {
      // const response: any = await this.httpService.loadClaimAnalysisData(this.formData.dateRangeStart, this.formData.dateRangeEnd);
  //     this.showPieChart = true
  //     this.showBarChart = true
  //     this.showDoughnutChart = true

  //     if (response?.status === 200) {
  //       this.pieChartData.labels = []
  //       this.pieChartData.datasets[0].data = []

  //       this.barChartData.labels = []
  //       this.barChartData.datasets[0].data = []

  //       this.doughnutChartData.labels = []
  //       this.doughnutChartData.datasets[0].data = []

  //       let idx = 0
  //       while (1) {
  //         if (idx >= response.data.length) { break; }
  //         this.pieChartData.labels.push(response.data[idx].organizationName)
  //         this.pieChartData.datasets[0].data.push(response.data[idx].claimNumber)

  //         this.barChartData.labels.push(response.data[idx].organizationName)
  //         this.barChartData.datasets[0].data.push(response.data[idx].claimNumber)

  //         this.doughnutChartData.labels.push(response.data[idx].organizationName)
  //         this.doughnutChartData.datasets[0].data.push(response.data[idx].claimNumber)
  //         idx++
  //       }
  //     }
  //   } catch (e) { }
  }


  formatDate(date: any) {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    let formattedDate = `${(jsDate.getMonth() + 1).toString().padStart(2, '0')}/${jsDate.getDate().toString().padStart(2, '0')}/${jsDate.getFullYear()}`;

    return formattedDate;
  }
}
