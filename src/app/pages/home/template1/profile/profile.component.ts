import { Component } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AppService} from "@services/app.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  employee: any = {
  };

  profilePicture: any = null

  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService
  ) {}

  ngOnInit(){
    this.getUserDetails();
  }

  async getUserDetails(){
    try {
      const response: any = await this.httpService.getUserDetails();
      if (response?.status === 200) {
        this.employee = response.data
      }
      if(this.employee.employeeImage != ""){
        this.profilePicture = this.employee.employeeImage
      }
    } catch (e) {}
  }

}
