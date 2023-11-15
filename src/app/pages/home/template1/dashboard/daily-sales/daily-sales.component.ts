import { Component } from '@angular/core';
import { AppService } from '@services/app.service';
import { salesLineChart } from '../chartObject';
import { StringHelper } from '@helpers/string.helper';

@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.component.html',
  styleUrls: ['./daily-sales.component.scss']
})
export class DailySalesComponent {
  monthlySalesChart: any;
  monthlyCollectionChart: any;
  salesSummary: any = {};

  showSalesChart: boolean = false;
  showCollectionChart: boolean = false;
  seriesObj = {
    name: '',
    data: [],
  }
  constructor(private httpService: AppService) {}
  
  ngOnInit() {
    this.getDailySales();
  }

  async getDailySales() {
    try {
      // const asca = await this.httpService.getTypeWIseProductList();
      const res = await this.httpService.getDailySales();
      if (res.data) {
        const salesData = res.data;
        const salesTypeWise = this.groupByKey(res.data, 'PRODUCT_TYPE');
        console.log('type',salesTypeWise)
        this.getMOnthlyLineChart(salesTypeWise, Object.keys(salesTypeWise));
        const currentDate = this.getCurrentDate();
        const prevDate = this.getCurrentDate(true);
        
        this.salesSummary.today = this.getDailySummary(salesData, currentDate);
        this.salesSummary.prev = this.getDailySummary(salesData, prevDate);
        this.salesSummary.thisMonth = this.getMonthlySummary(salesData);
      }
    } catch (error) {}
  }

  getDailySummary(data: any, date: any) {
    const filteredData = data.filter((item: any) => item.Date == date);

    let dailySum = {
      dailySoldInsurance: 0,
      dailyPremiumCollection: 0
    }
    dailySum.dailySoldInsurance =  filteredData.reduce((sum:any, item:any) => sum + parseInt(item.Daily_Sold_Insurance, 10), 0);
    dailySum.dailyPremiumCollection = filteredData.reduce((sum: any, item: any) => sum + parseInt(item.Daily_Premium_Collection, 10), 0);
    
    return dailySum;
  }
  getMonthlySummary(data:any) {
    const currentDate = new Date(); 
    const currentYear = currentDate.getFullYear(); 
    const currentMonth = currentDate.getMonth() + 1; 

    // Filter the data for the current year and month
    const filteredData = data.filter((item:any) => {
      const itemDate = new Date(item.Date);
      return itemDate.getFullYear() === currentYear && itemDate.getMonth() + 1 === currentMonth;
    });

    // Calculate the sum of dailySoldInsurance for the current month
    let monthlySum = {
      sumOfInsurance: 0,
      sumOfPremiumCollection: 0
    };
    monthlySum.sumOfInsurance = filteredData.reduce((sum:any, item:any) => sum + parseInt(item.Daily_Sold_Insurance, 10), 0);
    monthlySum.sumOfPremiumCollection = filteredData.reduce((sum: any, item: any) => sum + parseInt(item.Daily_Premium_Collection, 10), 0);
    
    return monthlySum;
  }

  // DAILY EVENTS LINE CHART
  getMOnthlyLineChart(res: any, typeList:any) {
    this.showSalesChart = false;
    this.monthlySalesChart = JSON.parse(JSON.stringify(salesLineChart));
    this.monthlyCollectionChart = JSON.parse(JSON.stringify(salesLineChart));
    let labels: any[] = [];
    // console.log("Dcx")

    for (let type of typeList) {
      let salesObj = JSON.parse(JSON.stringify(this.seriesObj));
      let clcObj = JSON.parse(JSON.stringify(this.seriesObj));
      salesObj.name = clcObj.name = type;
      
      const typeData = res[type];
      const dateWiseData = this.groupByKey(typeData, 'Date');
      const dateList: string[] = Object.keys(dateWiseData);
      console.log(type,dateList)
      for (let date of dateList) {
        !labels.includes(date) && labels.push(date);
        let totalS = 0;
        let totalC = 0;
        // @ts-ignore
        dateWiseData[date].map((data: any) => {
          totalS += data.Daily_Sold_Insurance
          totalC += data.Daily_Premium_Collection
        });
        salesObj.data.push(totalS);
        clcObj.data.push(totalC);
      }

      this.monthlySalesChart.series.push(salesObj)
      this.monthlyCollectionChart.series.push(clcObj)
      this.monthlySalesChart.labels = this.monthlyCollectionChart.labels = labels
      this.showSalesChart = true;
    }
    
    // this.showSalesChart = true;
  }

  getCurrentDate(prev:any | undefined = null ) {
    const currentDate = new Date();
    prev && currentDate.setDate(currentDate.getDate() - 1);

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); 
    const day = currentDate.getDate().toString().padStart(2, '0');

    return`${year}-${month}-${day}`;
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

  groupByKey(res: any, key: any) {
    return StringHelper.groupByKey(res, key);
  }
}
