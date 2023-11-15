import {ChangeDetectorRef, Component, Input, SimpleChanges} from '@angular/core';
import {AppService} from "@services/app.service";
import { ChartOptions, barColors, donutChart, lineChart } from './chartObjectsCD';
import { StringHelper } from '@helpers/string.helper';


@Component({
  selector: 'app-claim-dashboard',
  templateUrl: './claim-dashboard.component.html',
  styleUrls: ['./claim-dashboard.component.scss']
})
export class ClaimDashboardComponent {
  @Input() fromDate: any;
  @Input() toDate: any;

  showCA: boolean = false;
  showChartObj: any = {};
  dataObj: any = {};
  chartObjects: any = {};
  chartKeys: any[] = [];
  chartData: any = {};
  claimDataFields: any = [
    { key: 'index', label: 'SL' },
    { key: 'statisticsDate', label: 'Statistics Date' },
    // { key: 'locationArea', label: 'Area' },
    { key: 'paidAmount', label: 'Paid Amount' },
    { key: 'claimNumber', label: 'No. of Claims' },
    { key: 'billEntryVolume', label: 'Bill Entry' },
  ];

  seriesObj = {
    name: '',
    data: []
  };



  claimBarChart: Partial<ChartOptions> = {
    series: [],
    chart: {
      width: '100%',
      height: '300px',
      type: 'bar',
      redrawOnParentResize: true,
      events: {
        xAxisLabelClick: (chartContext: any, event: any, config: any) => {
          this.showChartOnclick(config.config.labels[config.labelIndex]);
        }
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '80%',
        orientation:'vertical',
      }
    },
    labels: [],
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#175e9c',
        },
        labels: {
          style: {
            colors: '#175e9c',
          },
        },
        title: {
          text: 'No. of Claims (in thousands)',
          style: {
            color: '#175e9c',
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      {
        seriesName: 'Amount',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#ca3374',
        },
        labels: {
          style: {
            colors: '#ca3374',
          },
        },
        title: {
          text: 'Paid Amount (in crore)',
          style: {
            color: '#ca3374',
          },
        },
        tooltip: {
          enabled: true,
        },
      },
    ],
    xaxis: { labels: { style: {cssClass: 'cursor-pointer',} } },
    colors: barColors,
  };
  
  constructor(private httpService: AppService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getClaimData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fromDate'] || changes['toDate']) {
      this.getClaimData().then(r => {
      });
    }
  }

  async getClaimData() {
    try {
      this.showCA = false;

      let resData: any;
      if (this.fromDate && this.toDate) {
        const response: any = await this.httpService.getClaimData(this.fromDate, this.toDate);
        resData = response?.data;
      } else {
        const response: any = await this.httpService.getClaimData();
        resData = response?.data;
      }
      if (resData) {
        const claimData = resData.claimAnalyses;
        this.chartData = this.groupByKey(claimData, 'locationArea');
        this.chartKeys = Object.keys(this.chartData);
        this.getBarChart(this.chartData, this.chartKeys);
        this.generateLineChart(this.chartData, this.chartKeys);
        this.cdr.detectChanges();
      }
    } catch (error) {}
  }

  // GENERATE BARCHART FOR ALL
  getBarChart(allData: any, keys: any) {
    this.claimBarChart.series = [];
    this.claimBarChart.labels = [];

    
    let objClaim = JSON.parse(JSON.stringify(this.seriesObj));
    objClaim.name = 'No. of Claims';
    let objPA = JSON.parse(JSON.stringify(this.seriesObj));
    objPA.name = 'Paid Amount';

    for (let key of keys) {
      const cData = allData[key];
      this.claimBarChart.labels.push(key);
      
      let totalPA = 0;
      let totalClaim = 0;
      cData.map((item: any) => {
        totalPA += parseInt(item.paidAmount);
        totalClaim += parseInt(item.claimNumber);
      });

      objClaim.data.push(this.toK(totalClaim));
      objPA.data.push(this.toCrore(totalPA));
      this.showCA = true;

      this.showChartObj[key] = false;
    }

    this.claimBarChart.series.push(objClaim);
    this.claimBarChart.series.push(objPA);
  }
 
// GENERATE CHARTS 
  generateLineChart(allData:any, keys:any) {
    for (let key of keys) {
      const cData = allData[key];
      let chart = JSON.parse(JSON.stringify(lineChart));
      chart.title.text = key;

      let claimObj = JSON.parse(JSON.stringify(this.seriesObj));
      claimObj.name = 'Claim Number';
      let paidObj = JSON.parse(JSON.stringify(this.seriesObj));
      paidObj.name = 'Paid Amount';


      cData.map((item: any) => {
        claimObj.data.push(this.toK(item.claimNumber));
        paidObj.data.push(this.toCrore(item.paidAmount));
        chart.labels.push(StringHelper.getFullMonthNameFromDate(item.statisticsDate));
      })
      
      chart.series.push(claimObj);
      chart.series.push(paidObj);
      this.chartObjects[key] = chart;


    }
  }  


// GROUP RESPONSE DATA BY COMPANY
  getGroupedByData(objData:any) {
    const grouped = objData.reduce((data:any, obj:any) => {
      const key = StringHelper.getFullMonthNameFromDate(obj.statisticsDate);
      if (!data[key]) {
        data[key] = [];
      }
      data[key].push(obj);
      return data;
    }, {});
  
    return grouped;
  }



  // SHOW CHART ONCLICK
  showChartOnclick(name: any) {
    console.log(name)
    this.showChartObj[name] = true;
    const el = 'chart' + name;
    setTimeout(() => {
      // @ts-ignore
      document.getElementById(el).scrollIntoView({ behavior: 'smooth' });
    }, 100);
    this.cdr.detectChanges();
  }

  // HIDE CHART ON CLOSE
  hideEl(key: any) {
    const el = 'chart' + key;
    document.getElementById(el)?.classList.add("fade");
    setTimeout(() => {
      this.showChartObj[key] = false;
      document.getElementById(el)?.classList.remove("fade");
      this.cdr.detectChanges();
    }, 400);
  }

  groupByKey(res: any, key: any) {
    return StringHelper.groupByKey(res, key);
  }

  

  toCrore(number: any) {
    return (number / 10000000).toFixed(2);
  }

  toK(number: any) {
    return (number / 1000).toFixed(2);
  }

}
