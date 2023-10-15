import {Component, Input, NgZone} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AppService} from "@services/app.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  @Input() paramReport: any = {};
  parameters: any[] = []

  constructor(
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private httpService: AppService
  ) {}

  fileFormat = [
    { value: '1', label: 'PDF' },
    { value: '2', label: 'Excel' }
  ];
  selectedFileFormat: any = null
  reportDetails: any;

  ngOnInit(){
  }



  async onSubmit(){
    try{
      // const foundReport = this.reportList.find(report => report.value === this.reportId);
      // let data = {
      //   reportXdoPath: foundReport.path,
      //   format: reportFormat?.label
      // }
      for(let param of this.paramReport.reportParam){
        if(param.dataType == "date"){
          this.parameters.push({paramName: param.paramName, value: this.formatInputDate(param.value)})
        }
        else{
          this.parameters.push({paramName: param.paramName, value: param.value})
        }
      }
      const reportFormat = this.fileFormat.find(format => format.value === this.selectedFileFormat);
      const response: any = await this.httpService.print(this.paramReport.reportId);

      let url = response.data+'/'+reportFormat?.label;
      if(this.parameters.length>0){url = url+"?"}
      for(let param of this.parameters){
        url = url + param.paramName + "=" + param.value + "&"
      }
      if(this.parameters.length>0){url = url.slice(0, -1);}
      if(response?.status === 200)
      {
        window.open(url,"_blank")
      }
    }catch (e){}
  }

  public async openTab(reportId: any, target: string) {
    // try {
    //   const success = await this.httpService.printReport(reportId)
    //   window.open(window.URL.createObjectURL(new Blob([success], {type: 'application/pdf'})));
    // }catch (Err){}
  }


  formatInputDate(date: any) {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    const year = jsDate.getFullYear();
    const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
    const day = jsDate.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

}
