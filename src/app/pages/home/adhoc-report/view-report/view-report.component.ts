import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@services/app.service';
import { ToastService } from '@services/toast-service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent {
  reportHeader: any = {
    companyName: "সাধারণ বীমা কর্পোরেশন",
    companyAddress: "প্রধান কার্যালয়, ৩৩, দিলকুশা বাণিজ্যিক এলাকা, ঢাকা-১০০০, বাংলাদেশ।",
    companyMail: "info@sbc.gov.bd",
    companyWebsite: "http://www.sbc.gov.bd"
  }

  reportResData: any[] = [];
  reportFields: any[] = [];
  reportName: any;

  constructor(private httpService: AppService, private toastService: ToastService, private route: ActivatedRoute) {
    
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const paramValue = params.get('reportName');

    });
    this.retrieveData();
  }

  retrieveData() {
    window.addEventListener('message', (event) => {
      this.reportResData = event.data.data;
      if (this.reportResData.length) {
        this.reportFields = Object.keys(this.reportResData[0]);
      }
    });
  }
  
  
  
  
  
  
  
}
