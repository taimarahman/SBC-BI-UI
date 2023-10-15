import {Component, Input, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent {
  @Input() chartData: any = {};
  @Input() chartType: any;


  public chartClicked(e: any): void {
    // console.log('clicked', e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

}
