import { Component } from '@angular/core';
import {FormBuilder, NgForm} from "@angular/forms";
import {AppService} from "@services/app.service";
import { Router } from '@angular/router';
import {StorageHelper} from "@helpers/storage.helper";
import {ToastService} from "@services/toast-service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  isLengthValid: boolean = false;
  isUpperCaseValid: boolean = false;
  isLowerCaseValid: boolean = false;
  isDigitValid: boolean = false;
  isSpecialCharValid: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService,
    private router: Router,
    private toastService: ToastService
  ) {}

  public async changeData(form: NgForm): Promise<void> {
    if (form.invalid) {
      console.log('FORM INVALID');
      this.toastService.show('FORM INVALID', {classname: 'bg-danger', delay: 4000});
      return;
    }else if(!this.isPasswordValid){
      this.toastService.show('NEW PASSWORD REQUIREMENTS NOT MET', {classname: 'bg-danger', delay: 4000});
    } else {
      await this.submitPassword();
    }
  }

  private async submitPassword() {
    try {
      const response = await this.httpService.changePassword(this.passwordData);
      if(response.status === 200){
        const logoutResponse: any = await this.httpService.logout();
        if(logoutResponse.data.statusCode === 1){
          while (StorageHelper.getToken()) {
            StorageHelper.removeToken();
            StorageHelper.removeMenu();
            StorageHelper.removeUser();
            StorageHelper.removeUserDtls();
            StorageHelper.removeFullScreen();
          }
          StorageHelper.clearItems();
          this.toastService.show(response.data, {classname: 'bg-success', delay: 4000});
          this.router.navigate(['/login']);
        }
      }
    } catch (err) {
      this.toastService.show('INVALID CURRENT PASSWORD', {classname: 'bg-danger', delay: 4000});
    }
  }

  checkPasswordRequirements() {
    this.isLengthValid = this.passwordData.newPassword.length >= 6;
    this.isUpperCaseValid = /[A-Z]/.test(this.passwordData.newPassword);
    this.isLowerCaseValid = /[a-z]/.test(this.passwordData.newPassword);
    this.isDigitValid = /\d/.test(this.passwordData.newPassword);
    this.isSpecialCharValid = /[!$#%]/.test(this.passwordData.newPassword);
  }

  get isPasswordValid(): boolean {
    return (
      this.isLengthValid &&
      this.isUpperCaseValid &&
      this.isLowerCaseValid &&
      this.isDigitValid &&
      this.isSpecialCharValid
    );
  }

}
