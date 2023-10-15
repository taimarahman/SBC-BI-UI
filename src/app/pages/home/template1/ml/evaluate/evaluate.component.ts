import {Component, Input} from '@angular/core';
import {AppService} from "@services/app.service";

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.scss']
})
export class EvaluateComponent {

  @Input() modelList: any[] = [];
  @Input() reportName: String = "";

  replaceUnderscoresWithSpaces(input: string): string {
    // return input.replace(/_/g, ' ');
    return input.replace(/[_-]/g, ' ');
  }

}
