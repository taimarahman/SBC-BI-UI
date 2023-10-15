import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ngb-data-table',
  templateUrl: './ngb-data-table.component.html',
  styleUrls: ['./ngb-data-table.component.scss'],
})
export class NgbDataTableComponent {
  @Input() tableData: any[] = [];
}
