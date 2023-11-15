import { Component } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AppService} from "@services/app.service";
import {Router} from "@angular/router";
import { StringHelper } from '@helpers/string.helper';

@Component({
  selector: 'app-interactive-dashboard',
  templateUrl: './interactive-dashboard.component.html',
  styleUrls: ['./interactive-dashboard.component.scss']
})
export class InteractiveDashboardComponent {

  fromDate: any;
  toDate: any;

  formData = {
    dateRangeStart: {
      year: 0,
      month: 0,
      day: 0,
    },
    dateRangeEnd: {
      year: 0,
      month: 0,
      day: 0,
    },
  };



  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService,
    private router: Router
  ) {
    const currentYear = StringHelper.getFinancialYearStart();
    this.fromDate = currentYear + '/01/01' ;
    this.toDate = currentYear + '/12/31';
   }

  showPieChart: boolean = false
  showBarChart: boolean = false
  showDoughnutChart: boolean = false

  ngOnInit() {    
  }


  async onSubmit() {

    this.fromDate = this.formatDate(this.formData.dateRangeStart)
    this.toDate = this.formatDate(this.formData.dateRangeEnd)
    console.log(this.fromDate);
  }

  formatDate(date: any) {
    return StringHelper.formatDateYYYYMMDD(date);
  }
}
