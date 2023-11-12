import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppService } from '@services/app.service';
import { DatepickerHelper } from '@helpers/datepicker.helper';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { highestClaimBarChart,accidentBarChart, claimDonutChart, dynamicBarChart, lineChart } from './chartObject';
import { StringHelper } from '@helpers/string.helper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: DatepickerHelper }],
})
export class DashboardComponent {

  fromDate: any;
  toDate: any;

  monthlySalesChart: any;
  salesSummary: any = {};

  showLineChart: boolean = false;
  showChart: boolean = false;

  foreCastClaimValue: any;
  agencyWiseTotalPremiumIncome: any;
  agencyWisePerformance: any;
  totalAccident: any;
  totalCompensationAmount: any;
  totalClaim: any;

  // HIGHEST CLAIM REPORT
  highestClaimReport: any[] = [];
  highestClaimBarChart: any;
  claimPieChart: any;

  HCClaimAmountData: any[] = [];
  HCPremiumAmountData: any[] = [];

  ARegionAmountData: any[] = [];
  AVehicleAmountData: any[] = [];
  ARegionCountData: any[] = [];
  AVehicleCountData: any[] = [];

  claimBarChartLabels: any[] = [];


  FCClaimAmountBarChart: any;
  FCReserveBarChart: any;
  FCLossBarChart: any;
  FCPremiumBarChart: any;

  accidentAnalysisData: any = {};
  claimAnalysisData: any[] = [];
  claimDataFields: any = [
    { key: 'index', label: 'SL' },
    { key: 'locationArea', label: 'Area' },
    { key: 'paidAmount', label: 'Paid Amount' },
    { key: 'claimNumber', label: 'No. of Claims' },
    { key: 'billEntryVolume', label: 'Bill Entry' },
  ];
  agencyDataFields: any = [
    { key: 'index', label: 'SL' },
    { key: 'agencyName', label: 'Agent Name' },
    { key: 'productName', label: 'Product Name' },
    { key: 'premiumIncome', label: 'Premium Income'}
  ];
  currentYear: any;

  seriesObj = {
    name: '',
    data: [],
  }

  constructor(
    private httpService: AppService,
  ) {
    this.currentYear = StringHelper.getFinancialYearStart();
    this.fromDate = this.currentYear + '/01/01' ;
    this.toDate = this.currentYear + '/12/31';

    this.FCClaimAmountBarChart = this.createBarChart(this.FCClaimAmountBarChart, 'Total Claim Amount', ['#079992']);
    this.FCReserveBarChart = this.createBarChart(this.FCReserveBarChart, 'Total Claim Reserve', ['#574b90']);
    this.FCLossBarChart = this.createBarChart(this.FCLossBarChart, 'Total Forcasted Losses', ['#c44569']);
    this.FCPremiumBarChart = this.createBarChart(this.FCPremiumBarChart, 'Average Premium', ['#34ace0']);



    this.highestClaimBarChart = highestClaimBarChart;
    this.highestClaimBarChart.series.map((item:any) => {
      if(item.name == 'Claim Amount') item.data = this.HCClaimAmountData;
      if(item.name == 'Premium Amount') item.data = this.HCPremiumAmountData;
    })

    this.claimPieChart = JSON.parse(JSON.stringify(claimDonutChart));

    

  }

  createBarChart(chart: any, title:string, color:any) {
    chart= JSON.parse(JSON.stringify(dynamicBarChart));
    chart.series[0].name = chart.title.text = title;
    chart.colors = color
    chart.labels = this.claimBarChartLabels;
    return chart;
  }

  showPieChart: boolean = false;
  showBarChart: boolean = false;
  claimBarChart = {
    CA: false,
    CR: false,
    FL: false,
    AP: false
  }

  ngOnInit() {
    this.showPieChart = false;
    this.getForeCastClaimReserveReport().then(r=> {
      this.claimBarChart.CA = true;
    }) ;
    this.getAgencyWiseTotalPremiumIncome();
   

    this.loadClaimAnalysisData().then((r) => {
      this.showPieChart = true;
    });
    this.getHighestClaimReport().then((r) => {
      this.showBarChart = true;
    });

    this.getDailySales();
  }

  async getDailySales() {
    try {
      const asca = await this.httpService.getTypeWIseProductList();
      const res = await this.httpService.getDailySales();
      if (res.data) {
        const salesData = res.data.dailyEventSummeryData;
        this.getMOnthlyLineChart(salesData);
        const currentDate = this.getCurrentDate();
        const prevDate = this.getCurrentDate(true);
        this.salesSummary.today = salesData.find((item: any) => item.date == currentDate);
        this.salesSummary.prev = salesData.find((item: any) => item.date == prevDate);
        this.salesSummary.thisMonth = this.getMonthlySummary(salesData)
      }
    } catch (error) {}
  }

  getMonthlySummary(data:any) {
    const currentDate = new Date(); 
    const currentYear = currentDate.getFullYear(); 
    const currentMonth = currentDate.getMonth() + 1; 

    // Filter the data for the current year and month
    const filteredData = data.filter((item:any) => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === currentYear && itemDate.getMonth() + 1 === currentMonth;
    });

    // Calculate the sum of dailySoldInsurance for the current month
    let monthlySum = {
      sumOfInsurance: 0,
      sumOfPremiumCollection: 0
    };
    monthlySum.sumOfInsurance = filteredData.reduce((sum:any, item:any) => sum + parseInt(item.dailySoldInsurance, 10), 0);
    monthlySum.sumOfPremiumCollection = filteredData.reduce((sum: any, item: any) => sum + parseInt(item.dailyPremiumCollection, 10), 0);
    
    return monthlySum;
  }

  // DAILY EVENTS LINE CHART
  getMOnthlyLineChart(res: any) {
    this.showLineChart = false;
    this.monthlySalesChart = JSON.parse(JSON.stringify(lineChart));
    let insObj = JSON.parse(JSON.stringify(this.seriesObj));
    insObj.name = "Insurance";
    let preObj = JSON.parse(JSON.stringify(this.seriesObj));
    preObj.name = "Premium Collection";

    res.map((item: any) => {
      insObj.data.push(item.dailySoldInsurance);
      preObj.data.push(item.dailyPremiumCollection);
      this.monthlySalesChart.labels.push(item.date);
    })

    this.monthlySalesChart.series.push(insObj);
    this.monthlySalesChart.series.push(preObj);
    this.showLineChart = true;
  }

  async loadClaimAnalysisData() {
    try {
      const currentYear = new Date().getFullYear();
      let startDate = '01-07-' + currentYear;
      let endDate = '30-06-' + (currentYear + 1);

      const response: any = await this.httpService.loadClaimAnalysisData(
        startDate,
        endDate
      );
      this.claimAnalysisData = response?.data;
      this.getChartData(this.claimAnalysisData);
    } catch (e) {}
  }

  getChartData(resData: any) {
    resData.map((item: any) => {
      this.claimPieChart.series.push(item.claimNumber);
      this.claimPieChart.labels.push(item.locationArea);
    });
  }

  formatInputDate(date: any) {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    let formattedDate = `${jsDate.getDate().toString().padStart(2, '0')}-${(
      jsDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${jsDate.getFullYear()}`;

    return formattedDate;
  }

  async getForeCastClaimReserveReport() {
    try {
      const response: any = await this.httpService.foreCastClaimReserveReport();
      if (response?.status === 200) {
        console.log(response?.data)
        this.foreCastClaimValue = response?.data;
        
        

      }
    } catch (error) {}
  }

  async getAgencyWiseTotalPremiumIncome() {
    try {
      const response: any = await this.httpService.agencyWiseAnalysis();
      if (response?.status === 200) {
        this.agencyWiseTotalPremiumIncome = response.data.totalPremiumIncome;
        this.agencyWisePerformance = response.data.agencyPerformance;
        this.totalAccident = response.data.accidentAnalysis;
        this.totalCompensationAmount =
          response.data.totalCompensationAndClaimAmount[0];
        this.totalClaim = response.data.totalCompensationAndClaimAmount[1];
      }
    } catch (error) {}
  }

  async getHighestClaimReport() {
    try {
      const response: any = await this.httpService.highestClaimReport();
      this.highestClaimReport = response?.data;
      if (this.highestClaimReport.length > 0) {
        this.highestClaimReport.map((item) => {
          this.HCClaimAmountData.push(item.claimAmount);
          this.HCPremiumAmountData.push(item.premiumAmount);
          this.highestClaimBarChart.xaxis.categories.push(item.territoryName);
        });
      }
      // this.getChartData(this.highestClaimReport);

    } catch (error) {}
  }

  


  setChartData(list: any) {
    list.map((item:any) => {
      this.FCClaimAmountBarChart.series[0].data.push(item.Total_Claim_Amount);
      this.FCReserveBarChart.series[0].data.push(item.Claim_Reserve);
      this.FCLossBarChart.series[0].data.push(item.Forecasted_Losses);
      this.FCPremiumBarChart.series[0].data.push(item.Average_Premium);
      this.claimBarChartLabels.push(item.Institution_Name);
    })
  }
  resetChartView() {
    this.claimBarChart = {
      CA: false,
      CR: false,
      FL: false,
      AP: false
    };
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }

  getCurrentDate(prev:any | undefined = null ) {
    const currentDate = new Date();
    prev && currentDate.setDate(currentDate.getDate() - 1);

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); 
    const day = currentDate.getDate().toString().padStart(2, '0');

    return`${year}-${month}-${day}`;
  }

  formatDateString(inputDate:any) {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  }

  formatToCrThousand(amount: any) {
    if (amount >= 10000000) {
      return (amount / 10000000).toFixed(2) + 'CR';
    } else if(amount >= 1000){
      return (amount / 1000).toFixed(2) + 'K';
    } else {
      return amount;
    }
    
  }
}
