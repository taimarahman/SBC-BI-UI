import {
  Component,
  Input,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AppService } from '@services/app.service';
// import 'datatables.net-bs4';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent {
  @Input() tableData: any[] = [];
  @Input() fields: any[] = [];
  // menuList: any[] = [];
  // @Input() activeYn?: TemplateRef<HTMLElement>;

  constructor(
    private httpService: AppService // private viewContainerRef: ViewContainerRef // private templateRef: TemplateRef<any>,
  ) {}
  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['pageColSize']) {
  //     this.pageSize = this.pageColSize != undefined ? this.pageColSize : '2';
  //   }
  //   if (changes['searchColSize']) {
  //     this.searchSize =
  //       this.searchColSize != undefined ? this.searchColSize : '3';
  //   }
  // }

  ngOnInit() {
    // this.loadMenus();

  }

  // async loadMenus() {
  //   try {
  //     const response: any = await this.httpService.getMenuList();
  //     this.menuList = response?.data;
  //   } catch (error) {}


  // }
}
