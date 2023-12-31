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
  pageHeight: number = 197;
  fieldset: any[] = [];
  constructor(private httpService: AppService, private toastService: ToastService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const paramValue = params.get('reportName');
      this.reportName = this.toReadableText(paramValue)
    });
    const storedData = localStorage.getItem('sharedData');
    if (storedData) {
      const retrieveData = JSON.parse(storedData);
      this.reportResData = retrieveData.data;
      this.fieldset = retrieveData.fieldset;
      // Do something with receivedData
      if (this.reportResData?.length) {
        this.reportFields = Object.keys(this.reportResData[0]);
        if (this.reportFields.length > 12) {
          this.pageWidth = 312;
        } else if (this.reportFields.length > 20) {
          this.pageWidth = 407;
          this.pageHeight = 210;
        }
      }
    }

    // Clear the data from localStorage if needed
    localStorage.removeItem('sharedData');

  }

  retrieveData() {
    window.addEventListener('message', (event) => {
      this.reportResData = event.data.data;
    }, {once: true});
  }

  findLabelByKey(keyToFind: string): string | undefined {
    const foundItem = this.fieldset.find(item => item.key === keyToFind);
    return foundItem ? foundItem.label : undefined;
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
    
    html2canvas(this.reportPage?.nativeElement).then(canvas => {
    // Few necessary setting options
    var imgWidth = this.pageWidth;
    var pageHeight = 295;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    var heightLeft = imgHeight;

    const contentDataURL = canvas.toDataURL('image/png')
    if(this.reportFields.length < 11) var pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    else var pdf = new jspdf('l', 'mm', [this.pageWidth, this.pageHeight]); 
    var position = 0;
    // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      // pdf.save(this.reportName + '.pdf'); // Generated PDF
      const addPage = () => {
        pdf.addPage();
        position = 0;
      };
  
      const addImageOnPage = (imgData: string) => {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
  
        if (heightLeft > 0) {
          addPage();
          addImageOnPage(canvas.toDataURL('image/png', 1.0)); // Continue adding images on new pages
        } else {
          pdf.save(this.reportName + '.pdf'); // Save PDF when all pages are added
        }
      };
  
      addImageOnPage(canvas.toDataURL('image/png', 1.0)); // Start adding images on pages
    
    });
}
  
  
}
