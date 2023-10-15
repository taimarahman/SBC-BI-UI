import {Component, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AppService} from "@services/app.service";
import {ChartData, ChartType} from 'chart.js';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill
} from "ng-apexcharts";

export type ChartOptions = {
  series: any | ApexAxisChartSeries;
  chart: any | ApexChart;
  dataLabels: any | ApexDataLabels;
  plotOptions: any | ApexPlotOptions;
  responsive: any | ApexResponsive[];
  xaxis: any | ApexXAxis;
  legend: any | ApexLegend;
  fill: any | ApexFill;
};


@Component({
  selector: 'app-claim-dashboard',
  templateUrl: './claim-dashboard.component.html',
  styleUrls: ['./claim-dashboard.component.scss']
})
export class ClaimDashboardComponent {
  dataValue: any;
  foreCastClaimValue: any;
  fruadAnalysisValue: any;
  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService
  ) {}

  showBarChart: boolean = false;
  showStackedChart: boolean = false;
  barChartType: ChartType = 'bar';

  ngOnInit() {
    this.showBarChart = false
    this.showStackedChart = false
    this.getForeCastClaimReserveReport();
    this.getProductClaimReport().then((r) => {
      this.displayStackedChart(r)
      this.displayBarChart(r)
    });
  }

  public barChartData: ChartData = {
    labels: [],
    datasets: [{
      barPercentage: 0.5,
      barThickness: 25,
      maxBarThickness: 100,
      minBarLength: 2,
      data: [],
      // backgroundColor: ['#ff7675'],
      backgroundColor: ['rgba(255, 99, 132, 0.4)',],
      label: ""
    },
    {
      barPercentage: 0.5,
      barThickness: 25,
      maxBarThickness: 100,
      minBarLength: 2,
      data: [],
      backgroundColor: ['rgba(255, 205, 86, 0.4)'],
      label: ""
    },
    {
      barPercentage: 0.5,
      barThickness: 25,
      maxBarThickness: 100,
      minBarLength: 2,
      data: [],
      backgroundColor: ['rgba(54, 162, 235, 0.4)'],
      label: ""
    },
    {
      barPercentage: 0.5,
      barThickness: 25,
      maxBarThickness: 100,
      minBarLength: 2,
      data: [],
      backgroundColor: ['rgba(75, 192, 192, 0.4)'],
      label: ""
    }
    ],
  };


  public stackedChartOptions: Partial<ChartOptions> = {
    series: [
      {
        name: "",
        data: [],
      },
      {
        name: "",
        data: []
      },
      {
        name: "",
        data: []
      },
      {
        name: "",
        data: []
      }
    ],
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: 60
      }
    },
    xaxis: {
      type: "category",
      categories: []
    },
    legend: {
      position: "right",
      offsetY: 40
    },
    fill: {
      colors: ['rgba(255, 99, 132, 0.4)','rgba(255, 205, 86, 0.4)','rgba(54, 162, 235, 0.4)','rgba(75, 192, 192, 0.4)'],
      opacity: 0.5
    }
  };


  // backgroundColor: [
  //   'rgba(255, 99, 132, 0.2)',
  //   'rgba(255, 159, 64, 0.2)',
  //   'rgba(255, 205, 86, 0.2)',
  //   'rgba(75, 192, 192, 0.2)',
  //   'rgba(54, 162, 235, 0.2)',
  //   'rgba(153, 102, 255, 0.2)',
  //   'rgba(201, 203, 207, 0.2)'
  // ]


  async getProductClaimReport() {
    try {
      const response: any = await this.httpService.productWiseClaimReport();
      if (response?.status === 200) {
        this.dataValue = response.data
      }
      return response
    } catch (error) { }
  }

  displayStackedChart(response: any){
    this.stackedChartOptions.xaxis.categories = []
    this.stackedChartOptions.series[0].data = []
    this.stackedChartOptions.series[1].data = []
    this.stackedChartOptions.series[2].data = []
    this.stackedChartOptions.series[3].data = []

    let idx = 0, i = 0
    let prevMonth = this.getMonth(response.data[idx].statisticsDate)
    this.stackedChartOptions.xaxis.categories.push(prevMonth)

    while (1) {
      if (idx >= response.data.length) { break; }
      let month = this.getMonth(response.data[idx].statisticsDate)

      if(prevMonth != month){
        this.stackedChartOptions.xaxis.categories.push(month)
        i=0
      }
      this.stackedChartOptions.series[i].data.push(response.data[idx].numberOfClaims)
      this.stackedChartOptions.series[i].name = response.data[idx].productName
      i++
      prevMonth = month
      idx++
    }
    this.showStackedChart = true
  }

  displayBarChart(response: any){
    this.barChartData.labels = []
    this.barChartData.datasets[0].data = []
    this.barChartData.datasets[1].data = []
    this.barChartData.datasets[2].data = []
    this.barChartData.datasets[3].data = []

    let idx = 0, i = 0
    let prevMonth = this.getMonth(response.data[idx].statisticsDate)
    this.barChartData.labels.push(prevMonth)

    while (1) {
      if (idx >= response.data.length) { break; }
      let month = this.getMonth(response.data[idx].statisticsDate)

      if(prevMonth != month){
        this.barChartData.labels.push(month)
        i=0
      }
      this.barChartData.datasets[i].data.push(response.data[idx].numberOfClaims)
      this.barChartData.datasets[i].label = response.data[idx].productName
      i++
      prevMonth = month
      idx++
    }
    this.showBarChart = true
  }


  getMonth(dateData: any) {
    const date = new Date(dateData);
    // const month = date.getMonth() + 1;
    const options = { month: 'long' };
    // @ts-ignore
    return date.toLocaleDateString('en-US', options);
  }

  async getForeCastClaimReserveReport() {
    try {
      const response: any = await this.httpService.foreCastClaimReserveReport();
      if (response?.status === 200) {
        this.foreCastClaimValue = response.data;
      }
    } catch (error) { }
  }
  // async getFraudAnalysisReport() {
  //   try {
  //     const response: any = await this.httpService.fraudAnalysisReport();
  //     if (response?.status === 200) {
  //       this.fruadAnalysisValue = response.data;
  //     }
  //   } catch (error) { }
  // }



}
