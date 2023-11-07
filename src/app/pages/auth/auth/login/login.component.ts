// Angular modules
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Internal modules
import { environment } from '@env/environment';
import { StorageHelper } from '@helpers/storage.helper';

// Services
import { AppService } from '@services/app.service';
import { StoreService } from '@services/store.service';
import { ToastManager } from '@blocks/toast/toast.manager';
import { ToastService } from "@services/toast-service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user = {
    userId: '',
    password: '',
  };
  password = '';
  show = false;
  disableBtn: boolean = false;

  showFP: boolean = false;

  public appName: string = environment.appName;
  public formGroup!: FormGroup<{
    userId: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(
    private router: Router,
    private storeService: StoreService,
    private toastService: ToastService,
    private appService: AppService,
    private formBuilder: FormBuilder
  ) {
    this.initFormGroup();
    this.formGroup = formBuilder.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
    }) as FormGroup<{
      userId: FormControl<string>;
      password: FormControl<string>;
    }>;
  }

  ngOnInit() {
    this.password = 'password';
  }

  // -------------------------------------------------------------------------------
  // NOTE Init ---------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private initFormGroup(): void {
    this.formGroup = new FormGroup({
      userId: new FormControl<string>(
        {
          value: '',
          disabled: false,
        },
        {
          validators: [Validators.required, Validators.email],
          nonNullable: true,
        }
      ),
      password: new FormControl<string>(
        {
          value: '',
          disabled: false,
        },
        { validators: [Validators.required], nonNullable: true }
      ),
    });
  }

  // -------------------------------------------------------------------------------
  // NOTE Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async onClickSubmit(): Promise<void> {
    await this.authenticate();
  }

  // -------------------------------------------------------------------------------
  // NOTE Requests -----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private async authenticate(): Promise<void> {
    this.disableBtn = true;
    // this.storeService.setIsLoading(true);
    while (StorageHelper.getToken() || StorageHelper.getUserDtls()) {
      StorageHelper.removeToken();
      StorageHelper.removeMenu();
      StorageHelper.removeUser();
      StorageHelper.removeUserDtls();
      StorageHelper.removeFullScreen();
    }
    this.user.userId = this.formGroup.controls.userId.getRawValue();
    this.user.password = this.formGroup.controls.password.getRawValue();
    const userId = this.formGroup.controls.userId.getRawValue();
    const password = this.formGroup.controls.password.getRawValue();
    const success = await this.appService.authenticate(this.user);
    this.disableBtn = false;

    if (success) {
      // GET MENU AND STORE
      const menuResponse = await this.appService.getMenu();
      if (menuResponse) {
        StorageHelper.setMenu(menuResponse.data);
      }
      // this.storeService.setIsLoading(false);
      const userDtlsResponse = await this.appService.getUserDtls();
      if (userDtlsResponse) {
        StorageHelper.setUserDtls(userDtlsResponse.data)
        var changePass = userDtlsResponse.data.needPassReset;
        console.log(userDtlsResponse.data)
      }

      let fullScreenData: any = {
        icon: '../../../../../assets/img/project/navbar/maximize.png',
        fullSize: false
      }
      StorageHelper.setFullScreen(fullScreenData);

      // NOTE Redirect to home
      if (changePass == 'Y') {
        this.router.navigate(['/change-password']);
      } else {
        this.router.navigate(['/dashboard-general']);
      }
      this.toastService.show('Successfully Logged In', { classname: 'bg-success', delay: 4000 });
    }
    else {
      this.toastService.show('Username or Password is Incorrect', { classname: 'bg-danger', delay: 4000 });
    }
  }

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  toggleFP() {
    this.showFP = !this.showFP;
  }
  // -------------------------------------------------------------------------------
  // NOTE Helpers ------------------------------------------------------------------
  // -------------------------------------------------------------------------------
}
