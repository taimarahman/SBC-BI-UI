import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { AppService } from '@services/app.service';
import { barChart, lineBarChart } from '../chartObjIA';
import { StringHelper } from '@helpers/string.helper';

@Component({
  selector: 'app-recruitment-summary',
  templateUrl: './recruitment-summary.component.html',
  styleUrls: ['./recruitment-summary.component.scss']
})
export class RecruitmentSummaryComponent {
  @Input() fromDate: any;
  @Input() toDate: any;

  showChart: boolean = false;
  recruitmentChart: any;
  seriesObj = {
    name: '',
    data: [],
    type: "column"
  };


  constructor(private httpService: AppService, private cdr: ChangeDetectorRef) {
    this.recruitmentChart = JSON.parse(JSON.stringify(lineBarChart));
   }
  


  ngOnChanges(changes: SimpleChanges) {
    if (changes['fromDate'] || changes['toDate']) {
      this.getRecruitmentData().then(r => {
      });
    }
  }

  async getRecruitmentData() {
    try {
      this.showChart = false;
      
      let resData: any;
      if (this.fromDate && this.toDate) {
        console.log('date:', this.fromDate, this.toDate )
        const response: any = await this.httpService.getRecruitmentData(this.fromDate, this.toDate);
        resData = response?.data;
      } else {
        const response: any = await this.httpService.getRecruitmentData();
        resData = response?.data;
      }

      if (resData) {
        this.getRecruitmentChart(resData);

      }
    } catch (error) {
      
    }
  }


  getRecruitmentChart(allData: any) {
    this.recruitmentChart.labels = [];
    this.recruitmentChart.series = [];

    let objTotal = JSON.parse(JSON.stringify(this.seriesObj));
    objTotal.name = 'Total';
    objTotal.type = "line";
    let objJoin = JSON.parse(JSON.stringify(this.seriesObj));
    objJoin.name = 'Join';
    let objResign = JSON.parse(JSON.stringify(this.seriesObj));
    objResign.name = 'Resign';
    
    for (let data of allData) {
      objTotal.data.push(data.totalPeople);
      objJoin.data.push(data.joinInThisMonth);
      objResign.data.push(data.resignThisMonth);
      this.recruitmentChart.labels.push(StringHelper.getFullMonthNameFromDate(data.statisticsDate));
    }
    this.recruitmentChart.series.push(objTotal);
    this.recruitmentChart.series.push(objJoin);
    this.recruitmentChart.series.push(objResign);
    this.showChart = true;
    console.log(this.recruitmentChart);
  }




}
