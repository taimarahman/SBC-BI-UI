import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppService } from '@services/app.service';
import {ToastService} from "@services/toast-service";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent {
  @Output() searchEvent = new EventEmitter<{
    create: boolean;
    search: boolean;
    table: boolean;
  }>();
  @Input() editData: any;

  formData: any = {
    employee: {},
    user: {
      userId: null,
      empId: null,
      username: null,
      userPass: null,
      userTypeId: '1',
      email: null,
      isActive: 'Y',
    },
  };
  submitBtnText: string = 'Save';
  formTitle: string = 'Create User';

  disableOnEdit: boolean = false;
  employeeList: any[] = [];
  organizationList: any[] = [];
  selectedEmployee: any = null;
  isEditing: boolean = false;

  selectedModule: any = {
    moduleId: null,
    moduleName: null,
  };

  constructor(
    private formBuilder: FormBuilder,
    private httpService: AppService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadEmployeeList();
    this.loadOrganizationList();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.editData.username) {
      this.enableEdit(this.editData);
    }
  }

  async loadEmployeeList() {
    try {
      const response: any = await this.httpService.getEmployeeList();
      if (response?.status === 200) {
        this.employeeList = [];
        for (let v of response.data) {
          this.employeeList.push({
            value: v.empId,
            label: v.empName,
            details: v,
          });
        }
      }
    } catch (e) {}
  }

  async onEmployeeSelected(empId: any) {
    const selectedEmployee = this.employeeList.find(
      (item) => item.value === empId
    );

    if (selectedEmployee) {
      this.selectedEmployee = selectedEmployee;
      this.formData.employee = this.selectedEmployee.details;
      this.formData.user.username = this.selectedEmployee?.details.empCode;
    }
  }
  valueData(valueData: any) {
    throw new Error('Method not implemented.');
  }

  async loadOrganizationList() {
    try {
      const response: any = await this.httpService.loadOrganizationList();
      if (response?.status === 200) {
        this.organizationList = [];
        for (let v of response.data) {
          this.organizationList.push({
            value: v.lookupId,
            label: v.lookUpName,
          });
        }
      }
    } catch (e) {}
  }

  async onSubmit() {
    try {
      if (!this.formData.$invalid) {
        if (!this.isEditing) {
          const saveResponse: any = await this.httpService.saveUser(
            this.formData.user
          );
          if (saveResponse.data.statusCode === 1) {
            this.onReset();
            this.toastService.show(saveResponse.data.message, {classname: 'bg-success', delay: 5000});
          } else {
            this.toastService.show(saveResponse.data.message, {classname: 'bg-danger', delay: 5000});
          }
        } else {
          const updateResponse: any = await this.httpService.updateUser(this.formData.user);

          if (updateResponse.data.statusCode === 1) {
            this.isEditing = false;
            this.onReset();
            this.ngOnInit();
            // window.location.reload();
            this.toastService.show(updateResponse.data.message, {classname: 'bg-success', delay: 5000});
          } else {
            this.toastService.show(updateResponse.data.message, {classname: 'bg-danger', delay: 5000});
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  onReset() {
    this.formData = {
      employee: {},
      user: {
        empId: null,
        username: null,
        userPass: null,
        userTypeId: '1',
        email: null,
        isActive: 'Y',
      },
    };
    this.disableOnEdit = false;
    this.isEditing = false;
    this.submitBtnText = 'Save';
    this.formTitle = 'Create User';
  }

  onSearchClick() {
    this.searchEvent.emit({ create: false, search: true, table: true });
  }

  enableEdit(data: any) {
    this.isEditing = true;
    this.formTitle = 'Update for ' + data.employeeName;
    this.disableOnEdit = true;
    this.formData.user.empId = data.userId;
    this.formData.user.userId = data.userId;
    this.formData.user.username = data.username;
    this.formData.user.userTypeId = data.userType == 'INTERNAL' ? '1' : '2';
    this.formData.user.email = data.email;
    this.formData.user.isActive = data.isActive;
    this.formData.user.designation = data.designationName;
    this.formData.user.depertment = data.departmentName;
    this.formData.user.division = data.division;
  }
}
