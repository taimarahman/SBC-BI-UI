import { Component, EventEmitter, Output } from '@angular/core';
import { StringHelper } from '@helpers/string.helper';
import { AppService } from '@services/app.service';
import { ToastService } from '@services/toast-service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  @Output() toggleFP = new EventEmitter<void>();

  email: any | undefined;
  OTP: any | undefined;
  display: any;

  disableBtn: boolean = false;
  
  showOTP: boolean = false;
  resend: boolean = false;

  constructor(private httpService: AppService,
    private toastService: ToastService,
  ) {
    this.showOTP = false;
  }

  async sendOTP() {
    try {
      this.disableBtn = true;
      const res = await this.httpService.getOTPMail(this.email);
      this.disableBtn = false;
      if (res.status == 200) {
        this.toastService.show(res.data, {classname: 'bg-success', delay: 3000});
        this.showOTP = true;
        this.timer();
      } else {
        this.toastService.show(res.data, {classname: 'bg-danger', delay: 3000});
      }
    } catch (error) {
      this.disableBtn = false;
      this.toastService.show('Something went wrong', {classname: 'bg-danger', delay: 3000});
    }
  }
  
  async resendOTP() {
    try {
      this.disableBtn = true;
      const res = await this.httpService.resendOTPMail(this.email);
      this.disableBtn = false;
      if (res.status == 200) {
        this.toastService.show(res.data, {classname: 'bg-success', delay: 3000});
        this.showOTP = true;
        this.timer();
      } else {
        this.toastService.show(res.data, {classname: 'bg-danger', delay: 3000});
      }
    } catch (error) {
      this.disableBtn = false;
      this.toastService.show('Something went wrong', {classname: 'bg-danger', delay: 3000});
    }
  }


  async submitOTP() {
    try {
      this.disableBtn = true;
      const res = await this.httpService.verifyOTP(this.email, this.OTP);
      this.disableBtn = false;
      if (res.status == 200) {
        this.toggleFP.emit();
        this.toastService.show(res.data, {classname: 'bg-success', delay: 3000});
      } else {
        this.toastService.show(res.data, {classname: 'bg-danger', delay: 3000});
      }
    } catch (error) {
      this.disableBtn = false;
      this.toastService.show('Something went wrong', {classname: 'bg-danger', delay: 3000});
    }
  }
  
  numberOnly(ev: any) {
    StringHelper.numberOnly(ev);
  }

  toggleOTP() {
    this.showOTP = !this.showOTP;
  }

  timer() {
    let minute = 0.5;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = seconds < 60 ? seconds : 60;

    const prefix = minute < 10 ? "0" : "";

    setTimeout(() => {
      console.log(seconds, "dsc", this.resend);
      this.resend = true;
      console.log( this.resend);

    }, seconds*1000);

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log("finished");
        clearInterval(timer);
      }
    }, 1000);

    
  }


}
