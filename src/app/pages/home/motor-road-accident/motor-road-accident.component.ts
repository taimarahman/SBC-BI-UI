import { Component } from '@angular/core';
import { AppService } from '@services/app.service';
import { barChart } from './chartObjectsMRA';

@Component({
  selector: 'app-motor-road-accident',
  templateUrl: './motor-road-accident.component.html',
  styleUrls: ['./motor-road-accident.component.scss']
})
export class MotorRoadAccidentComponent {

  sbcRGCountBarChart: any;
  jbcRGCountBarChart: any;
  metlifeRGCountBarChart: any;
  sonaliRGCountBarChart: any;

  sbcRGAmountBarChart: any;
  jbcRGAmountBarChart: any;
  metlifeRGAmountBarChart: any;
  sonaliRGAmountBarChart: any;

  sbcVHBarChart: any;
  jbcVHBarChart: any;
  metlifeVHBarChart: any;
  sonaliVHBarChart: any;

  hideSpinner: boolean = false;

  showbarChart: boolean = false;
  

  seriesObj = {
    name: '',
    data: []
  }

  constructor(private httpService: AppService) {
    this.sbcRGCountBarChart = JSON.parse(JSON.stringify(barChart));
    this.jbcRGCountBarChart = JSON.parse(JSON.stringify(barChart));
    this.metlifeRGCountBarChart = JSON.parse(JSON.stringify(barChart));
    this.sonaliRGCountBarChart = JSON.parse(JSON.stringify(barChart));
    
    this.sbcRGAmountBarChart = JSON.parse(JSON.stringify(barChart));
    this.jbcRGAmountBarChart = JSON.parse(JSON.stringify(barChart));
    this.metlifeRGAmountBarChart = JSON.parse(JSON.stringify(barChart));
    this.sonaliRGAmountBarChart = JSON.parse(JSON.stringify(barChart));

    this.sbcVHBarChart = JSON.parse(JSON.stringify(barChart));
    this.jbcVHBarChart = JSON.parse(JSON.stringify(barChart));
    this.metlifeVHBarChart = JSON.parse(JSON.stringify(barChart));
    this.sonaliVHBarChart = JSON.parse(JSON.stringify(barChart));
  }

  ngOnInit() {
    this.getAccidentData();
  }

  async getAccidentData() {
    try {
      const response: any = await this.httpService.getAccidentData();
      if (response?.data) {
        const regionData: any[] = response?.data?.regionWiseAccidentAnalysisData;
        console.log(regionData)
        const institutionData = this.getGroupedByData(regionData);
        const sbcData = institutionData[1];
        const jbcData = institutionData[2];
        const metlifeData = institutionData[3];
        const sonaliData = institutionData[4];
        
        // barchart.yaxis.title.text = 'No. of Customers'
        const countYaxisLabel = 'No. of Accident'
        const amountYaxisLabel = 'Total Claim Amount'
        console.log(metlifeData)
        // REGION COUNT
        this.sbcRGCountBarChart = this.createBarChatData(this.sbcRGCountBarChart, sbcData, 'predicted_count', countYaxisLabel);
        this.jbcRGCountBarChart = this.createBarChatData(this.jbcRGCountBarChart, jbcData, 'predicted_count', countYaxisLabel)
        this.metlifeRGCountBarChart = this.createBarChatData(this.metlifeRGCountBarChart,  metlifeData, 'predicted_count', countYaxisLabel);
        this.sonaliRGCountBarChart = this.createBarChatData(this.sonaliRGCountBarChart,  sonaliData, 'predicted_count', countYaxisLabel)
        // REGION AMOUNT
        this.sbcRGAmountBarChart = this.createBarChatData(this.sbcRGAmountBarChart, sbcData, 'predicted_amount', amountYaxisLabel);
        this.jbcRGAmountBarChart = this.createBarChatData(this.jbcRGAmountBarChart, jbcData, 'predicted_amount', amountYaxisLabel)
        this.metlifeRGAmountBarChart = this.createBarChatData(this.metlifeRGAmountBarChart,  metlifeData, 'predicted_amount', amountYaxisLabel);
        this.sonaliRGAmountBarChart = this.createBarChatData(this.sonaliRGAmountBarChart,  sonaliData, 'predicted_amount', amountYaxisLabel)

        console.log('jbc',this.metlifeRGCountBarChart)

        // this.sbcVHBarChart = this.createBarChatData(this.sbcVHBarChart, sbcData,'predicted_amount', amountYaxisLabel);
        // this.jbcVHBarChart = this.createBarChatData(this.jbcVHBarChart, jbcData,'predicted_amount', amountYaxisLabel)
        // this.metlifeVHBarChart = this.createBarChatData(this.metlifeVHBarChart,'predicted_amount', metlifeData, amountYaxisLabel);
        // this.sonaliVHBarChart = this.createBarChatData(this.sonaliVHBarChart,'predicted_amount', sonaliData, amountYaxisLabel)
        
        this.showbarChart = true;
      }
      
    } catch (error) {
      
    }
    
    
  }

  createBarChatData(chartObj: any, chartdata: any, property: string, yaxisTitle: any) {
    let label: any[] = []
    
    for (let item of chartdata) {
      !label.includes(item.year) && label.push(item.year);
      if (chartObj.series.length > 0) {
        let oldObj = chartObj.series.find((obj: any) => obj.name == item.city);
        if (oldObj) {
          oldObj.data.push(parseInt(item[property]));
      } else {
        let columnObj = JSON.parse(JSON.stringify(this.seriesObj));
        columnObj.name = item.city;
        columnObj.data.push(parseInt(item[property]));
        chartObj.series.push(columnObj)
      }

     } else { // length = 0
        let columnObj = JSON.parse(JSON.stringify(this.seriesObj));
        columnObj.name = item.city;
        columnObj.data.push(parseInt(item[property]));
        chartObj.series.push(columnObj)
     }
    }
    console.log(label)
    chartObj.labels = label;
    chartObj.yaxis.title.text = yaxisTitle;

    return chartObj;
  }

  getGroupedByData(objData:any) {
    const grouped = objData.reduce((data:any, obj:any) => {
      const key = obj.instituteCode;
      if (!data[key]) {
        data[key] = [];
      }
      data[key].push(obj);
      return data;
    }, {});
  
    return grouped;
  }

}
