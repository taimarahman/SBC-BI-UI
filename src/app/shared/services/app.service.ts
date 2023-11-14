// Angular modules
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// External modules
import { ArrayTyper } from '@caliatys/array-typer';
import { TranslateService } from '@ngx-translate/core';
import axios, { AxiosRequestConfig } from 'axios';
import { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import { AxiosInstance } from 'axios';
import { CreateAxiosDefaults } from 'axios';

// Internal modules
import { ToastManager } from '@blocks/toast/toast.manager';
import { environment } from '@env/environment';

// Helpers
import { StorageHelper } from '@helpers/storage.helper';

// Enums
import { Endpoint } from '@enums/endpoint.enum';

// Models

// Services
import { StoreService } from './store.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { log } from 'console';

@Injectable()
export class AppService {
  // NOTE Default configuration
  private default: CreateAxiosDefaults = {
    withCredentials: true,
    timeout: 990000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      protocol: 'http',
      host: 'localhost',
      port: 4200,
    },
  };

  // NOTE Instances
  private api: AxiosInstance = axios.create({
    baseURL: environment.apiBaseUrl,
    ...this.default,
  });

  // NOTE Controller
  private controller: AbortController = new AbortController();
  private _passUserData: any;

  constructor(
    private storeService: StoreService,
    private toastManager: ToastManager,
    private router: Router,
    private translateService: TranslateService
  ) {
    this.initRequestInterceptor(this.api);
    this.initResponseInterceptor(this.api);
    this.initAuthHeader();
  }

  // ----------------------------------------------------------------------------------------------
  // SECTION Methods ------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------

  public async authenticate(user: any): Promise<boolean> {
    // return Promise.resolve(true);

    StorageHelper.removeToken();
    const url = '/user/login';
    const { data } = await this.api.post(url, user);
    if (!data) {
      this.toastManager.quickShow('Invalid user', 'danger');
      return false;
    } else if (data.status) {
      // let userName = JSON.parse(atob(data.token.split('.')[1])).sub;
      StorageHelper.setToken(data.token);
      // StorageHelper.setUser(data.token);
      this.initAuthHeader();
      this.toastManager.quickShow(data.message, 'success');
      return Promise.resolve(true);
    } else {
      this.toastManager.quickShow(data.message, 'danger');
      return false;
    }
  }

  public async validateAccount(
    token: string,
    password: string
  ): Promise<boolean> {
    return Promise.resolve(true);
  }

  // !SECTION Methods

  // ----------------------------------------------------------------------------------------------
  // SECTION Helpers ------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------
  private initAuthHeader(): void {
    const token = StorageHelper.getToken();
    if (!token) {
      return;
    }
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    this.api.defaults.headers.common['Token'] = token;
  }

  public initRequestInterceptor(instance: AxiosInstance): void {
    // this.storeService.setIsLoading(true);
    try {
      instance.interceptors.request.use(
        (config) => {
          // console.log('interceptors.request.config', config);
          // this.storeService.setIsLoading(true);
          return config;
        },
        (error) => {
          this.toastManager.quickShow(error);
          return Promise.reject(error);
        }
      );
    } catch (error) {
      console.log(error);
      return;
    }
  }

  public initResponseInterceptor(instance: AxiosInstance): void {
    try {
      instance.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          if (error.response != undefined) {
            this.toastManager.quickShow(error.response.data.message, 'danger');
            if (error.response.status == 401) {
              Promise.reject(error);
              return this.router.navigate(['/login']);
            }
          } else {
            this.toastManager.quickShow('Network error', 'danger');
          }
          return Promise.reject(error);
        }
      );
    } catch (error) {
      // console.log(error);
      return;
    }
  }

  isTokenExpired(): boolean {
    const token = StorageHelper.getToken();
    if (!token) {
      return true
    }
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      // Token should consist of three parts: header, payload, signature
      return true;
    }

    const payloadBase64 = tokenParts[1];
    const payload = JSON.parse(atob(payloadBase64));


    const expirationTimeInSeconds = payload.exp;

    // const expirationTime = JSON.parse(atob(token.split('.')[1])).exp;
    const currentTimestampInSeconds = Math.floor(new Date().getTime() / 1000);
    if (expirationTimeInSeconds <= currentTimestampInSeconds) {
      return true;
    }
    return false;
  }

  // MENU API
  public async getMenu() {
    return this.api.get('/user/menu');
  }

  public async saveMenu(data: any) {
    return this.api.post('/user/menu/save', data);
  }

  public async updateMenu(data: any) {
    return this.api.post(`/user/menu/update`, data);
  }

  public async loadMenu() {
    return this.api.get('/user/menu/menuListName');
  }

  public async saveSubmenu(data: any) {
    return this.api.post('/user/submenu/save', data);
  }

  public async updateSubmenu(data: any) {
    return this.api.post(`/user/submenu/update`, data);
  }

  // GET MENU LIST
  public async getMenuList() {
    return this.api.get('/user/menu/menu-list');
  }

  // GET SUBMENU LIST
  public async getSubMenuList() {
    return this.api.get('/user/submenu/submenu-list');
  }

  // GET ROLE LIST
  public async getRoleList() {
    return this.api.get('/user/role/role-list');
  }

  public async saveUser(data: any) {
    return this.api.post('/user/save-data', data);
  }
  public async updateUser(data: any) {
    return this.api.post('user/update-data', data);
  }


  public async roleEntrySave(data: any) {
    return this.api.post('/user/save-role', data);
  }

  public async roleEntryUpdate(data: any) {
    return this.api.post('/user/update-role', data);
  }

  public async loadOrganizationList() {
    return this.api.get('/user/reference-list');
  }

  public async loadUsers() {
    return this.api.get('user/user-lists');
  }

  public async getRolesOfUser(userId: any) {
    return this.api.get(`user/user-role-list/${userId}`);
  }
  // !SECTION Helpers

  // GET PERMISSION LIST FOR SPECIFIC ROLE
  public async getRolePermissionList(roleId: any) {
    return this.api.get(`/user/menu/role-menu-submenu-list/${roleId}`);
  }

  public async saveUserRole(data: any) {
    return this.api.post('/user/save/user-role', data);
  }
  //Create User
  public async getEmployeeList() {
    return this.api.get('/user/employee-list');
  }

  // SAVE ROLE WISE MENU-SUBMENU ACCESS
  public async saveRoleWiseMenuSubmenuAccess(reqData: any) {
    return this.api.post('/user/menu/role-menu-submenu/save', reqData);
  }

  public async printReport(reportId: any): Promise<any> {
    // const url = "/print-report/" + reportId;
    // const { data } = await this.api.post(url, {}, { responseType: 'blob' });
    // if (!data)
    //   return null;
    // return data;
  }

  // GET ROLE WISE USER LIST
  public async getRoleWiseUserList(roleId: any) {
    return this.api.get(`user/role-wise-userList/${roleId}`);
  }

  //UNASSIGN USER FROM ROLE
  public async unassignUserRole(userId: any, roleId: any) {
    return this.api.delete(`/user/delete-user-assign-role/${userId}/${roleId}`);
  }

  public async loadSearchUserList(data: any) {
    return this.api.post('/user/user-listValue', data);
  }

  // GET ALL REPORT LIST
  public async getReportList() {
    return this.api.get('report/report-list');
  }
  public async getIdWiseReportList(id: any) {
    return this.api.get(`report/report-list/${id}`);
  }

  public async saveReport(data: any) {
    return this.api.post('/report/save-report', data);
  }

  public async updateReport(data: any) {
    return this.api.post('/report/update-report', data);
  }

  public async deleteReport(data: any) {
    return this.api.post('/report/delete-report', data);
  }

  public async saveRoleWiseReportAccess(data: any) {
    return this.api.post('report/role-report/save', data);
  }

  public async getRoleReportPermissionList(roleId: any) {
    return this.api.get(`report/role-wise-report-list/${roleId}`);
  }

  public async getReportListByRole() {
    return this.api.get('report/role-report-list');
  }

  public async loadUser(userId: any) {
    return this.api.get(`/user/single-user-value/${userId}`);
  }

  public async loadClaimAnalysisData(startDate: any, endDate: any) {
    return this.api.get(`/claim/claim-list/${startDate}/${endDate}`);
  }

  public async loadReportData(reportId: any, pageNo: any) {
    return this.api.get(`/analysis-report-list/${reportId}/${pageNo}`);
  }

  public async getCaramelReportData(reportId: any) {
    return this.api.get(`/report/caramel-report/${reportId}`);
  }

  public async pushCsvFileForTrain(file: File, reportId: any) {
    let formData: FormData = new FormData();
    formData.append("file", file);
    formData.append("reportId", reportId);
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return this.api.post('/claim/csv-file-upload-train-purpose', formData, config);
  }

  public async predict(report: any, formData: any) {

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return this.api.post(`/report/predict/analysis-by-${report}`, formData, config);
  }

  public async submitDataForPredict(data: any, reportId: any) {
    return this.api.post(`/claim/object-csv-file-predict-purpose/${reportId}`, data);
  }

  public async getUserDetails() {
    return this.api.get(`/user/user-profile`);
  }

  //Logout User
  public async logout() {
    return this.api.get('/user/logout');
  }

  public async getUserActivityLog() {
    return this.api.get(`/user/user-activity-log`);
  }

  public async changePassword(data: any) {
    return this.api.post(`/user/update/password`, data);
  }

  public async getUserDtls() {
    return this.api.get(`/user/user-profile-display`);
  }

  public async getAllUserActivityList() {
    return this.api.get(`/user/user-activity-list`);
  }

  public async getUserAllActivityLog(username: any) {
    return this.api.get(`/user/all-user-activity-log/${username}`);
  }

  public getpassUserData(): any {
    return this._passUserData;
  }

  public setpassUserData(value: any) {
    this._passUserData = value;
  }

  public async resetPassword(username: any) {
    return this.api.get(`user/user-reset-password/${username}`);
  }

  public async productWiseClaimReport() {
    return this.api.get(`claim/product-claim-list`);
  }

  public async foreCastClaimReserveReport() {
    return this.api.get(`claim/forecast-claim-reserve-list`);
  }

  public async agencyWiseAnalysis() {
    return this.api.get(`claim/agency-wise-analysis`);
  }

  public async fraudAnalysisReport() {
    return this.api.get(`claim/fraud-analysis`);
  }

  public async highestClaimReport() {
    return this.api.get(`claim/highest-claim-loss-premium`);
  }

  public async accidentSummaryReport() {
    return this.api.get(`accident/accident-analysis-by-region-vehicle`);
  }

  public async print(reportId: any) {
    return this.api.get(`report/print-report/${reportId}`);
  }

  public async loadModelDetails(reportId: any) {
    return this.api.get(`/evaluate/ml-model-data-list/${reportId}`);
  }

  public async saveParamReport(data: any) {
    return this.api.post(`/report/save-parameter-report`, data);
  }

  public async trainActivityPermission() {
    return this.api.get(`/report/activity-train-report`);
  }

  public async deleteParameter(param: any) {
    return this.api.post(`/report/delete-report-param`, param);
  }

  public async submitDataForTrain(data: any, reportId: any) {
    return this.api.post(`/claim/object-csv-file-train-purpose/${reportId}`, data)
  }

  // OPERATIONS DATA
  public async getEXOperationsData() {
    return this.api.get(`/operation/operation-data-list`);
  }
  // FINANCIAL DATA
  public async getEXFinancialData() {
    return this.api.get(`/financial/financial-data-list`);
  }

  // Accident data
  public async getAccidentData(fromDate: any | undefined = null, toDate: any | undefined = null) {
    return this.api.get(`/accident/accident-analysis-by-date-wise/${fromDate}/${toDate}`);
  }

  // FRAUD DETECTION data
  public async getFraudDetectiontData(fromDate: any | undefined = null, toDate: any | undefined = null) {
    return this.api.get(`/fraud/fraud-analysis-by-date-wise?fromDate=${fromDate}&toDate=${toDate}`);
  }

  // FRAUD DETECTION data
  public async getClaimData(fromDate: any | undefined = null, toDate: any | undefined = null) {
    return this.api.get(`/claim/claim-list-by-date-wise?fromDate=${fromDate}&toDate=${toDate}`);
  }

  public async pushCsvFileForPredict(file: File, reportId: any) {
    let formData: FormData = new FormData();
    formData.append("file", file);
    formData.append("reportId", reportId);
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return this.api.post('/claim/csv-file-upload-predict-purpose', formData, config);
  }

  public async printCaramelsReport(columnName: any, reportId: any) {
    return this.api.get(`caramels/caramels-column-url/${columnName}/${reportId}`);
  }


  // DASHBOARD API
 
  public async getDailySales(fromDate: any | undefined = null, toDate: any | undefined = null) {
    return this.api.get(`/dashboard/daily-events-by-date-wise?fromDate=${fromDate}&toDate=${toDate}`);
  } 

  public async getRecruitmentData(fromDate: any | undefined = null, toDate: any | undefined = null) {
    return this.api.get(`/dashboard/recruitment-manpower-list?fromDate=${fromDate}&toDate=${toDate}`);
  } 
  
  public async getTypeWIseProductList() {
    return this.api.get(`/dashboard/daily-events-filter-data`);
  } 




  // FORGOT PASSWORD
  public async getOTPMail(email: any) {
    return this.api.get(`/user/forget-password/${email}`);
  }

  public async resendOTPMail(email: any) {
    return this.api.get(`user/resend-otp/${email}`); 
  }

  public async verifyOTP(email: any, OTP:any) {
    return this.api.get(`/user/check-otp/${email}/${OTP}`); 
  }


  // ADHOC REPORT API
  
  public async getAdhocTableList() {
    return this.api.get(`/ad-hoc/table-list`); 
  }
  public async getAdhocDataList(tableName:any) {
    return this.api.get(`/ad-hoc/column-list/${tableName}`); 
  }
  public async generateAdhocReport(reqData:any) {
    return this.api.post(`/ad-hoc/query-value`, reqData); 
  }
  
}
