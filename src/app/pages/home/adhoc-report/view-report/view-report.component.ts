import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StringHelper } from '@helpers/string.helper';
import { AppService } from '@services/app.service';
import { ToastService } from '@services/toast-service';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent {
  @ViewChild('reportPage') reportPage: ElementRef | undefined;

  reportHeader: any = {
    companyName: "সাধারণ বীমা কর্পোরেশন",
    companyAddress: "প্রধান কার্যালয়, ৩৩, দিলকুশা বাণিজ্যিক এলাকা, ঢাকা-১০০০, বাংলাদেশ।",
    companyMail: "info@sbc.gov.bd",
    companyWebsite: "http://www.sbc.gov.bd"
  }

  reportResData: any[] = [];
  reportFields: any[] = [];
  reportName: any;
  pageWidth: number = 208;
  pageHeigth: number = 157;
  constructor(private httpService: AppService, private toastService: ToastService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const paramValue = params.get('reportName');
      this.reportName = this.toReadableText(paramValue)
    });
    this.retrieveData();
  }

  retrieveData() {
    window.addEventListener('message', (event) => {
      this.reportResData = event.data.data;
      if (this.reportResData?.length) {
        this.reportFields = Object.keys(this.reportResData[0]);
        if (this.reportFields.length > 12) {
          this.pageWidth = 312;
        } else if (this.reportFields.length > 20) {
          this.pageWidth = 407;
          this.pageHeigth = 210;
        }
      }
    });
  }
  
  toReadableText(inputString: any) {
    if (inputString.includes('_'))  return this.removeUnderscore(inputString);
    else return this.convertCapToTitleCase(inputString);
    
  }
  convertCapToTitleCase(inputString: string) {
    return StringHelper.convertCapToTitleCase(inputString);
  }
  removeUnderscore(inputString:any) {
    return StringHelper.convertSnakeToTitleCase(inputString);
  }
  
  
  public convetToPDF()
{
    // @ts-ignore

    console.log("el",this.reportPage?.nativeElement)
    // @ts-ignore
    html2canvas(this.reportPage?.nativeElement).then(canvas => {
    // Few necessary setting options
    var imgWidth = this.pageWidth;
    var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      console.log(canvas.width,"canvas.height", canvas.height, 'imgHeight', imgHeight)
    var heightLeft = imgHeight;

    const contentDataURL = canvas.toDataURL('image/png')
      // let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
     
    let pdf = new jspdf('l', 'mm', [this.pageWidth, this.pageHeigth]); // A4 size page of PDF
    var position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    pdf.save(this.reportName + '.pdf'); // Generated PDF
    });
}
  
  
}
