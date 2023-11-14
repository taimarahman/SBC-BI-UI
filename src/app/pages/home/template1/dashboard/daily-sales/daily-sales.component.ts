import { Component } from '@angular/core';
import { AppService } from '@services/app.service';
import { lineChart } from '../chartObject';

@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.component.html',
  styleUrls: ['./daily-sales.component.scss']
})
export class DailySalesComponent {
  monthlySalesChart: any;
  salesSummary: any = {};

  showLineChart: boolean = false;
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
}
