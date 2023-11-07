import { Component, TemplateRef} from '@angular/core';
import { AppService } from '@services/app.service';
import { ToastService } from "@services/toast-service";
import { StringHelper } from '@helpers/string.helper';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { radialChart } from './chartObjectsFn';

@Component({
  selector: 'app-financial-dashboard',
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.scss'],

})
export class FinancialDashboardComponent {

  hideSpinner: boolean = false;
  showCRRadial: boolean = false;
  currentYear: number;
  sbcFinancialData: any;
  sbcCRRadialChart: any;
  sbcCSRRadialChart: any;

  dataLabel: any = {
    'main_business_income': 'main business income',
    'profit_principal_operations': 'Profit from principal operations',
    'profit_margin': 'Profit margin',
    'com_solvency_adequacy_ratio': 'Comprehensive Solvency Adequacy Ratio',
    'core_solvency_ratio': 'Core solvency ratio',
    'real_capital': 'Real capital',
    'minimum_capital': 'Minimum capital',
    'operating_profit_margin': 'Operating profit margin',
    'acc_rece_turnover': 'Accounts Receivable Turnover',
    'assets_liabilities': 'Assets and liabilities',
    'cash_ratio': 'Cash ratio',
  };

  keyDescriptionObject : any = {
    'main_business_income': 'Total financial caliber operating income during the statistical period',
    'profit_principal_operations': 'Total financial profit during the statistical period',
    'profit_margin': 'Profit from net assets per operating income',
    'com_solvency_adequacy_ratio': 'Comprehensive solvency ratio = (authorized assets - authorized liabilities) / minimum capital',
    'core_solvency_ratio': 'The ratio of core authorized assets-accredited liabilities to the minimum capital in the financial caliber during the statistical period',
    'real_capital': 'Total actual capital during the statistical period',
    'minimum_capital': 'Total minimum capital during the statistical period',
    'operating_profit_margin': "The ratio of the company’s operating profit to operating income",
    'acc_rece_turnover': 'The average number of times accounts receivable were converted to cash during the specified analysis period',
    'assets_liabilities': 'Indicates how much of the company\'s total assets are raised through liabilities',
    'cash_ratio': "Indicates the company's ability to pay current debts without relying on inventory sales and receivables",
  };

  constructor(private httpService: AppService) {
  
    this.currentYear = StringHelper.getFinancialYearStart();
    this.sbcCRRadialChart = JSON.parse(JSON.stringify(radialChart));
    this.sbcCSRRadialChart = JSON.parse(JSON.stringify(radialChart));


  }

  ngOnInit() {
    this.getFinancialData().then(r => this.hideSpinner = true);
  }

  public async getFinancialData() {
    const response = await this.httpService.getEXFinancialData();
    this.sbcFinancialData = response?.data?.getSBCBIFinancialReportData;
    console.log(this.sbcFinancialData.acc_rece_turnover)
    if (this.sbcFinancialData) {
      console.log(this.dataLabel['cash_ratio'])
      // this.sbcCRRadialChart.labels.push(this.dataLabel['cash_ratio']);
      this.formatData();
    }

  }

  formatData() {
    this.sbcFinancialData.operating_profit_margin = this.numberToCrores(this.sbcFinancialData.operating_profit_margin)
      this.sbcFinancialData.profit_margin = this.numberToCrores(this.sbcFinancialData.profit_margin)
      this.sbcFinancialData.profit_principal_operations = this.numberToCrores(this.sbcFinancialData.profit_principal_operations)
      this.sbcFinancialData.main_business_income = this.numberToCrores(this.sbcFinancialData.main_business_income)
      this.sbcCRRadialChart.series.push(this.sbcFinancialData.cash_ratio*100);
      // this.sbcCSRRadialChart.labels.push(this.dataLabel['core_solvency_ratio']);
      this.sbcCSRRadialChart.series.push(this.sbcFinancialData.core_solvency_ratio*100);
      this.showCRRadial = true;
  }

  numberToCrores(number: any): any {
    if (number > 9999999) {
      const croreValue = (number / 10000000).toFixed(2);
      return `${croreValue} cr`;
    }
    return `${Math.floor(parseInt(number))}`;
  }


  // toTextLg(text:any): string {
  //   if (text) {
  //     const processedText = text.replace(/(\d+)/g, "<span class='h1'>$1</span>");
  //     return processedText;
  //   }
  //   return '';
  // }


}
