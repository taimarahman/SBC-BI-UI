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
  
  jbcData: any[] = [];
 
  jbcBarChart: any;
  jbcPieChart: any;

  hideSpinner: boolean = false;
  showBIAChart: boolean = false;
  showBIABarChart: boolean = false;
  
  seriesObj = {
    name: '',
    data: []
  }

  chartLabels = ['<1yr', '5yr',
    // '6yr',
    '10yr', '20yr', '1-5yr',
    // '6-10yr',
    '10-20yr', '20-30yr'] // total 7

  constructor(private httpService: AppService) {
    this.jbcBarChart = JSON.parse(JSON.stringify(barChart));
    this.jbcPieChart = JSON.parse(JSON.stringify(pieChart));

  }

  ngOnInit() {
    this.getOperationsData().then(r => this.hideSpinner = true);
  }

  public async getOperationsData() {
    const response = await this.httpService.getEXOperationsData();
    
    this.jbcData = response?.data?.getJBCBIOperationData;
    const jbcGroupedData = this.groupByKey(this.jbcData, 'insuranceType') 
 
    if (jbcGroupedData) {
      [this.jbcBarChart, this.jbcPieChart] = this.getBIAChartData(jbcGroupedData, this.jbcBarChart, this.jbcPieChart);
      this.showBIAChart = true;
    }
  }




  getBIAChartData(res: any, barchart: any, piechart:any) {

    barchart.labels = this.chartLabels;
    barchart.yaxis.title.text = 'No. of Customers'

    const keys = Object.keys(res);

    for (let key of keys) {
      const oData = res[key];
      let currentObj = JSON.parse(JSON.stringify(this.seriesObj));

      let total1YrBelow = 0;
      let total5Yr = 0;
      let total6Yr = 0;
      let total10Yr = 0;
      let total20Yr = 0;
      let total1Yr5Yr = 0;
      let total6Yr10Yr = 0;
      let total10Yr20Yr = 0;
      let total20Yr30Yr = 0;

      let totalTrainee = 0;
      oData.map((item: any) => {
        if (currentObj.name == '') currentObj.name = item.insuranceType;
        !piechart.labels.includes(item.insuranceType) && piechart.labels.push(item.insuranceType);
        total1YrBelow += parseInt(item.customerNum1YrBelow);
        total5Yr += parseInt(item.customerNum5Yr);
        // total6Yr += parseInt(item.customerNum6Yr);
        total10Yr += parseInt(item.customerNum10Yr);
        total20Yr += parseInt(item.customerNum20Yr);
        total1Yr5Yr += parseInt(item.customerNum1Yr5Yr);
        // total6Yr10Yr += parseInt(item.customerNum6Yr10Yr);
        total10Yr20Yr += parseInt(item.customerNum10Yr20Yr);
        total20Yr30Yr += parseInt(item.customerNum20Yr30Yr);
        totalTrainee += parseInt(item.totalCustomerNumber);
      })
      
      currentObj.data.push(total1YrBelow);
      currentObj.data.push(total5Yr);
      // currentObj.data.push(total6Yr);
      currentObj.data.push(total10Yr);
      currentObj.data.push(total20Yr);
      currentObj.data.push(total1Yr5Yr);
      // currentObj.data.push(total6Yr10Yr);
      currentObj.data.push(total10Yr20Yr);
      currentObj.data.push(total20Yr30Yr);

      barchart.series.push(currentObj);
      piechart.series.push(totalTrainee);
      
    }

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
      this.showBIABarChart = false;

      el.classList.remove('fade');
    }, 400)
  }

  groupByKey(res: any, key: any) {
    let list: any = {};
    for (const item of res) {
      const itemKey:any = item[key];

      if (!list[itemKey]) {
        list[itemKey] = [];
      }
      list[itemKey].push(item);
    }

    return list;
  }
}
