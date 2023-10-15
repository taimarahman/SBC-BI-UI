import { Component } from '@angular/core';
import { AppService } from '@services/app.service';
import { barChart, pieChart } from './chartObjectsOP';

@Component({
  selector: 'app-operations-dashboard',
  templateUrl: './operations-dashboard.component.html',
  styleUrls: ['./operations-dashboard.component.scss']
})
export class OperationsDashboardComponent {
  chartData: any[] = [];
  sbcData: any[] = [];
  jbcData: any[] = [];
  biaData: any[] = [];

  sbcBarChart: any;
  jbcBarChart: any;
  biaBarChart: any;

  sbcPieChart: any;
  jbcPieChart: any;
  biaPieChart: any;

  hideSpinner: boolean = false;

  showSBCChart: boolean = false;
  showJBCChart: boolean = false;
  showBIAChart: boolean = false;
  
  showSBCBarChart: boolean = false;
  showJBCBarChart: boolean = false;
  showBIABarChart: boolean = false;
  
  seriesObj = {
    name: '',
    data: []
  }

  chartLabels = ['<1yr', '5yr', '6yr', '10yr', '20yr', '1-5yr', '6-10yr', '10-20yr', '20-30yr'] // total 9

  constructor(private httpService: AppService) {
    this.sbcBarChart = JSON.parse(JSON.stringify(barChart));
    this.jbcBarChart = JSON.parse(JSON.stringify(barChart));
    this.biaBarChart = JSON.parse(JSON.stringify(barChart));

    this.sbcPieChart = JSON.parse(JSON.stringify(pieChart));
    this.jbcPieChart = JSON.parse(JSON.stringify(pieChart));
    this.biaPieChart = JSON.parse(JSON.stringify(pieChart));

  }

  ngOnInit() {
    this.getOperationsData().then(r => this.hideSpinner = true);
  }

  public async getOperationsData() {
    const response = await this.httpService.getEXOperationsData();
    // console.log(response?.data);
    
    this.sbcData = response?.data?.getSBCBIOperationData;
    this.jbcData = response?.data?.getJBCBIOperationData;
    this.biaData = response?.data?.getBIABIOperationData;

    if (this.sbcData) {
      [this.sbcBarChart, this.sbcPieChart] = this.getSBCChartData(this.sbcData, this.sbcBarChart, this.sbcPieChart);
      // console.log(this.sbcPieChart)
      this.showSBCChart = true;
    }
    if (this.jbcData) {
      [this.jbcBarChart, this.jbcPieChart] = this.getJBCChartData(this.jbcData, this.jbcBarChart, this.jbcPieChart);
      this.showJBCChart = true;      
    }
    if (this.biaData) {
      [this.biaBarChart, this.biaPieChart] = this.getBIAChartData(this.biaData, this.biaBarChart, this.biaPieChart);
      this.showBIAChart = true;
    }
  }



  getSBCChartData(res: any, barchart: any, piechart:any) {

    barchart.labels = this.chartLabels;
    barchart.yaxis.title.text = 'No. of Customers'

    res.map((item:any) => {
      let currentObj = JSON.parse(JSON.stringify(this.seriesObj));
      currentObj.name = item.location;
      currentObj.data.push(item.customers_1yr_below) 
      currentObj.data.push(item.customers_5yr) 
      currentObj.data.push(item.customers_6yr) 
      currentObj.data.push(item.customers_10yr) 
      currentObj.data.push(item.customers_20yr) 
      currentObj.data.push(item.customers_1yr_5yr) 
      currentObj.data.push(item.customers_6yr_10yr) 
      currentObj.data.push(item.customers_10yr_20yr) 
      currentObj.data.push(item.customers_20yr_30yr)       

      barchart.series.push(currentObj);

      // PIE CHART DATA
      piechart.series.push(item.total_customers);
      piechart.labels.push(item.location);
    })

    return [barchart,piechart];
  }

  getJBCChartData(res: any, barchart: any, piechart:any) {

    barchart.labels = this.chartLabels;
    barchart.yaxis.title.text = 'No. of Customers'

    res.map((item:any) => {
      let currentObj = JSON.parse(JSON.stringify(this.seriesObj));
      currentObj.name = item.location;
      currentObj.data.push(item.customers_1year_below) 
      currentObj.data.push(item.customers_5years) 
      currentObj.data.push(item.customers_6years) 
      currentObj.data.push(item.customers_10years) 
      currentObj.data.push(item.customers_20years) 
      currentObj.data.push(item.customers_1to5years) 
      currentObj.data.push(item.customers_6to10years) 
      currentObj.data.push(item.customers_10to20years) 
      currentObj.data.push(item.customers_20to30years)       

      barchart.series.push(currentObj);
      
      // PIE CHART DATA
      piechart.series.push(item.total_customers);
      piechart.labels.push(item.location);
    })

    return [barchart,piechart];
  }

  getBIAChartData(res: any, barchart: any, piechart:any) {

    barchart.labels = this.chartLabels;
    barchart.yaxis.title.text = 'No. of Trainees'


    res.map((item:any) => {
      let currentObj = JSON.parse(JSON.stringify(this.seriesObj));
      currentObj.name = item.institution_name;
      currentObj.data.push(item.trainee_1yr_below_count) 
      currentObj.data.push(item.trainee_5yr_count) 
      currentObj.data.push(item.trainee_6yr_count) 
      currentObj.data.push(item.trainee_10yr_count) 
      currentObj.data.push(item.trainee_20yr_count) 
      currentObj.data.push(item.trainee_1_5yr_count) 
      currentObj.data.push(item.trainee_6_10yr_count) 
      currentObj.data.push(item.trainee_10_20yr_count) 
      currentObj.data.push(item.trainee_20_30yr_count)       

      barchart.series.push(currentObj);

      // PIE CHART DATA
      piechart.series.push(item.total_trainee_count);
      piechart.labels.push(item.institution_name);
    })

    return [barchart,piechart];
  }

// SCROLL TO ELEMENT
  scroll(el: HTMLElement) {
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth' });   
    }, 100)
  }

  hideEl(el: HTMLElement, flag:any) {
    el.classList.add('fade');
    setTimeout(() => {
      if (flag == 'sbc') this.showSBCBarChart = false;
      else if (flag == 'jbc') this.showJBCBarChart = false;
      else this.showBIABarChart = false;

      el.classList.remove('fade');
    }, 400)
  }
}
