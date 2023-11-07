import { ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { AppService } from '@services/app.service';
import { ChartOptions, barChart } from './chartObjectsFD';

@Component({
  selector: 'app-fraud-detection',
  templateUrl: './fraud-detection.component.html',
  styleUrls: ['./fraud-detection.component.scss']
})
export class FraudDetectionComponent {

  @ViewChild('yesChart') yesChart: ElementRef | undefined;
  @ViewChild('noChart') noChart: ElementRef | undefined;

  @ViewChild('yesRefuse') yesRefuse: ElementRef | undefined;
  @ViewChild('noRefuse') noRefuse: ElementRef | undefined;

  @Input() fromDate: any;
  @Input() toDate: any;
  // ratioPieChart: any;
  fraudBarChart: any;
  notFraudBarChart: any;
  showFraudRatio: boolean = false;
  showRatioChart: boolean = false;
  showYesChart: boolean = false;
  showNoChart: boolean = false;

  refuseBarChart: any;
  notRefuseBarChart: any;
  showClaimRatioChart: boolean = false;
  showRefuseYesChart: boolean = false;
  showRefuseNoChart: boolean = false;


  chartFlag: any;

  seriesObj = {
    name: '',
    data: []
  }

  ratioPieChart: Partial<ChartOptions> = {
    series: [],
    chart: {
        width: '100%',
        type: 'pie',
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            this.showChartOnClick(config.w.config.labels[config.dataPointIndex]);
          }
        }
    },
    colors: [ '#c44569', '#38ada9'],
    labels: ['Fraud', 'Not Fraud'],
    fill: {
      opacity: 0.5,
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          legend: {
            position:'bottom'
          }
          
        },
      },
    ],
  };
  premiumPieChart: Partial<ChartOptions> = {
    series: [],
    chart: {
        width: '100%',
        type: 'pie',
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            this.showChartOnClick(config.w.config.labels[config.dataPointIndex]);
          }
        }
    },
    colors: [ '#c44569', '#38ada9'],
    labels: ['Refused', 'Not Refused'],
    fill: {
      opacity: 0.5,
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          legend: {
            position:'bottom'
          }
        },
      },
    ],
  };

  constructor(private httpService: AppService, private cdr: ChangeDetectorRef) {
    this.fraudBarChart = JSON.parse(JSON.stringify(barChart));
    this.notFraudBarChart = JSON.parse(JSON.stringify(barChart));
    this.refuseBarChart = JSON.parse(JSON.stringify(barChart));
    this.notRefuseBarChart = JSON.parse(JSON.stringify(barChart));
    
  }

  ngOnInit() {
    this.getFraudDetectiontData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fromDate'] || changes['toDate']) {
      this.getFraudDetectiontData().then(r => {
      });
    }
  }

  async getFraudDetectiontData() {
    try {
      this.showRatioChart = false;
      this.showFraudRatio = false;
      this.ratioPieChart.series = [];
      this.premiumPieChart.series = [];
      let resData: any;
      if (this.fromDate && this.toDate) {
        console.log('date:', this.fromDate, this.toDate )
        const response: any = await this.httpService.getFraudDetectiontData(this.fromDate, this.toDate);
        resData = response?.data;
      } else {
        const response: any = await this.httpService.getFraudDetectiontData();
        resData = response?.data;
      } 
      if (resData) {
        const fraudData = resData.liabilityAssessments;
        const refuseData = resData.premiumCollections;
               
        if (parseInt(resData.totalFraudYesInLiabilityAssessmentData) && parseInt(resData.totalFraudNoInLiabilityAssessmentData)) {
          this.ratioPieChart.series.push(parseInt(resData.totalFraudYesInLiabilityAssessmentData));
          this.ratioPieChart.series.push(parseInt(resData.totalFraudNoInLiabilityAssessmentData));
          
          fraudData.length && this.getFraudBarChart(fraudData);
          
          this.showFraudRatio = true;
        }

        if (parseInt(resData.totalClaimRefusalYesInPremiumCollectionData) && parseInt(resData.totalClaimRefusalYesInPremiumCollectionData)) {
          this.premiumPieChart.series.push(parseInt(resData.totalClaimRefusalYesInPremiumCollectionData));
          this.premiumPieChart.series.push(parseInt(resData.totalClaimRefusalNoInPremiumCollectionData));

          refuseData.length && this.getRefuseBarChart(refuseData);

          this.showRatioChart = true;
        }

        this.cdr.detectChanges();

      }
    } catch (error) {}
  }

  getFraudBarChart(allData: any) {
    const groupedData = this.groupByKey(allData, 'fraud');
    this.refuseBarChart.series = [];
    this.notRefuseBarChart.series = [];
    
    let yesColObj = JSON.parse(JSON.stringify(this.seriesObj));
    yesColObj.name = 'Fraud';
    let noColObj = JSON.parse(JSON.stringify(this.seriesObj));
    noColObj.name = 'Not Fraud';

    Object.keys(groupedData).forEach(key => {
      const currList = groupedData[key];
      const currGroup = this.groupByKey(currList, 'organization_type');
      const orgs = Object.keys(currGroup)
      let label: any[] = [];

      for (let org of orgs) {
        label.push(org);
        if (key == 'Yes') yesColObj.data.push(currGroup[org].length);
        else noColObj.data.push(currGroup[org].length);
      }

      if (key == 'Yes') this.fraudBarChart.labels = label;
      else this.notFraudBarChart.labels = label;
    })

    this.fraudBarChart.series.push(yesColObj);
    this.notFraudBarChart.series.push(noColObj);
  }

  getRefuseBarChart(allData: any) {
    const groupedData = this.groupByKey(allData, 'claimRefusal');
    this.refuseBarChart.series = [];
    this.notRefuseBarChart.series = [];
    this.refuseBarChart.xaxis.type = this.notRefuseBarChart.xaxis.type = 'datetime'
    let yesColObj = JSON.parse(JSON.stringify(this.seriesObj));
    yesColObj.name = 'Refused';
    let noColObj = JSON.parse(JSON.stringify(this.seriesObj));
    noColObj.name = 'Not Refused';

    Object.keys(groupedData).forEach(key => {
      const currList = groupedData[key];
      const currGroup = this.groupByKey(currList, 'date');
      const allDates = Object.keys(currGroup)
      let label: any[] = [];

      for (let date of allDates) {
        label.push(date);
        if (key == 'Yes') yesColObj.data.push(currGroup[date].length);
        else noColObj.data.push(currGroup[date].length);
      }

      if (key == 'Yes') this.refuseBarChart.labels = label;
      else this.notRefuseBarChart.labels = label;
    })

    this.refuseBarChart.series.push(yesColObj);
    this.notRefuseBarChart.series.push(noColObj);
  }
  

  showChartOnClick(flag: any) {
    if (flag == 'Fraud') {
      this.showYesChart = true;
      setTimeout(() => {
        this.yesChart?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if(flag == 'Not Fraud') {
      this.showNoChart = true;
      setTimeout(() => {
        this.noChart?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    else if(flag == 'Refused') {
      this.showRefuseYesChart = true;
      setTimeout(() => {
        this.yesRefuse?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      this.showRefuseNoChart = true;
      setTimeout(() => {
        this.noRefuse?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }

    this.cdr.detectChanges();

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


  hideEl(el: HTMLElement, flag:any) {
    el.classList.add('fade');

    setTimeout(() => {
      if (flag == 'fraud') this.showYesChart = false;
      else if (flag == 'not fraud') this.showNoChart = false;
      else if (flag == 'refuse') this.showRefuseYesChart = false;
      else this.showRefuseNoChart = false;
      this.cdr.detectChanges();

      el.classList.remove('fade');
    }, 400);

  }
}
