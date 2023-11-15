import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { AppService } from '@services/app.service';
import { ChartOptions, backgroundColor, barChart, donutChart } from './chartObjectsMRA';
import { StringHelper } from '@helpers/string.helper';

@Component({
  selector: 'app-motor-road-accident',
  templateUrl: './motor-road-accident.component.html',
  styleUrls: ['./motor-road-accident.component.scss']
})
export class MotorRoadAccidentComponent {

  @Input() fromDate: any;
  @Input() toDate: any;


  regionDonutChart: any;
  vehicleDonutChart: any;

  regionChartObj: any = {};
  vehicleChartObj: any = {};

  hideSpinner: boolean = false;

  showRegionDetails: boolean = false;
  showVehicleDetails: boolean = false;

  showRegionChart: boolean = false;
  showVehicleChart: boolean = false;
  

  seriesObj = {
    name: '',
    data: []
  }
 
  

  constructor(private httpService: AppService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getAccidentData().then(r => this.hideSpinner = true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fromDate'] || changes['toDate']) {
      this.getAccidentData().then(r => this.hideSpinner = true);
    }
  }

  async getAccidentData() {
    try {
      this.showRegionChart = false;
      this.showVehicleChart = false;

      let resData: any;
      if (this.fromDate && this.toDate) {
        const response: any = await this.httpService.getAccidentData(this.fromDate, this.toDate);
        resData = response?.data;
      } else {
        const response: any = await this.httpService.getAccidentData();
        resData = response?.data;
      }
      if (resData) {
        const regionData = resData?.regionWiseAccidentAnalysisData;
        const vehicleData = resData?.vehicleTypeWiseAccidentAnalysisData;

        if (regionData.length) {
          this.regionDonutChart = JSON.parse(JSON.stringify(donutChart));
          const regionGroupData = this.groupByKey(regionData, 'city');
          this.regionDonutChart = this.getDonutChart(regionGroupData, this.regionDonutChart);  
          this.regionChartObj = this.createBarChatData(regionGroupData, this.regionChartObj);
          
          this.showRegionChart = true;
        }

        if (vehicleData.length) {
          this.vehicleDonutChart = JSON.parse(JSON.stringify(donutChart));
          const vehicleGroupData = this.groupByKey(vehicleData, 'vehicle');
          this.vehicleDonutChart = this.getDonutChart(vehicleGroupData, this.vehicleDonutChart);  
          this.vehicleChartObj = this.createBarChatData(vehicleGroupData, this.vehicleChartObj);
          
          this.showVehicleChart = true;
        }
      }
      
    } catch (error) {}
  }




  // GENERATE PIECHART FOR ALL
  getDonutChart(res: any, chart: any) {
    const keys = Object.keys(res);

    for (let key of keys) {
      const cData = res[key];
      chart.labels.push(key);
      let totalACC = 0;
      cData.map((item: any) => {
        totalACC += item.predicted_count;
      });

      chart.series.push(totalACC);
    }

    return chart;
  }

  createBarChatData(res: any, chartObj: any) {
    let countChart = JSON.parse(JSON.stringify(barChart));
    let claimChart = JSON.parse(JSON.stringify(barChart));
    let labels:any[] = [];
    const keys = Object.keys(res);

    for (let key of keys) { 
      const cData = res[key];
      const countObj = JSON.parse(JSON.stringify(this.seriesObj));
      const claimObj = JSON.parse(JSON.stringify(this.seriesObj));
      countObj.name = claimObj.name = key;
      
      cData.map((item: any) => {
        !labels.includes(item.year) && labels.push(item.year);
        countObj.data.push(item.predicted_count);
        claimObj.data.push(item.predicted_amount);
      })

      countChart.series.push(countObj);
      claimChart.series.push(claimObj);
    }

    countChart.labels = claimChart.labels = labels;

    chartObj.count = countChart;
    chartObj.claim = claimChart;

    return chartObj;
  }


  // SCROLL TO ELEMENT
  scroll(el: HTMLElement) {

    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth' });   
    }, 100)
    this.cdr.detectChanges();

  }

  // HIDE CHART ON CLOSE
  hideEl(el: any, flag:any) {
    el.classList.add('fade');
    setTimeout(() => {
      if (flag == 'region') this.showRegionDetails = false;
      else this.showVehicleDetails = false;
      el.classList.remove('fade');
    }, 400)
    this.cdr.detectChanges();

  }


  groupByKey(res: any, key: any) {
    return StringHelper.groupByKey(res, key);
  }
}
