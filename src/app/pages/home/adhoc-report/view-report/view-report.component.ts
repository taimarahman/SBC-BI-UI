import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
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

  isEventListenerRegistered = false;
  reportResData: any[] = [];
  reportFields: any[] = [];
  reportName: any;
  pageWidth: number = 210;
  pageHeigth: number = 197;
  constructor(private httpService: AppService, private toastService: ToastService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const paramValue = params.get('reportName');
      this.reportName = this.toReadableText(paramValue)
    });

    const listenerPromise = new Promise<void>((resolve) => {
      window.addEventListener('message', (event) => {
        if (!this.isEventListenerRegistered) {
          this.isEventListenerRegistered = true;
          resolve();
        }
      });
    });

    listenerPromise.then(() => {
      this.retrieveData();
    });
  }

  retrieveData() {
    window.addEventListener('message', (event) => {
      console.log("vfdfv")
      this.reportResData = event.data.data;
      console.log(this.reportResData)
      if (this.reportResData?.length) {
        this.reportFields = Object.keys(this.reportResData[0]);
        if (this.reportFields.length > 12) {
          this.pageWidth = 312;
        } else if (this.reportFields.length > 20) {
          this.pageWidth = 407;
          this.pageHeigth = 210;
        }
      }
    }, {once: true});
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
    if(this.reportFields.length < 11) var pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    else var pdf = new jspdf('l', 'mm', [this.pageWidth, this.pageHeigth]); 
    var position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    pdf.save(this.reportName + '.pdf'); // Generated PDF
    });
}
  
  
}
