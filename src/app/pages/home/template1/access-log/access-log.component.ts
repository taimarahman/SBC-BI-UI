import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@services/app.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-access-log',
  templateUrl: './access-log.component.html',
  styleUrls: ['./access-log.component.scss']
})
export class AccessLogComponent implements OnInit {
  dataValue: any;
  passUserData: any;

  constructor(private http: AppService, private router: Router, private activatedRoute: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.passUserData = this.http.getpassUserData();
    this.activatedRoute.url.subscribe((urlSegments) => {
      const currentRoute = urlSegments.join('/');

      if (currentRoute === 'activity-log-admin' && this.passUserData !== null) {
        this.getUserAllLogDetails();
      } else {
        this.getUserDetails();
      }
    });
  }

  async getUserDetails() {
    try {
      const response: any = await this.http.getUserActivityLog();
      if (response?.status === 200) {
        this.dataValue = response.data
      }
    } catch (e) { }
  }

  isUserLoggedIn(item: any): boolean {
    return item.loginTime !== null;
  }

  async getUserAllLogDetails() {
    try {
      const response: any = await this.http.getUserAllActivityLog(this.passUserData);
      if (response?.status === 200) {
        this.dataValue = response.data
      }
    } catch (e) { }
  }

  back() {
    this.location.back();
  }

}
