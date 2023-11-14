// Angular modules
import { NgModule } from '@angular/core';

// Internal modules
import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

// Components
import { HomeComponent } from './home.component';
import { NavBarComponent } from '@layouts/nav-bar/nav-bar.component';
import { RoleMenuMappingComponent } from './admin/role-menu-mapping/role-menu-mapping.component';
import { AssignRoleToUserComponent } from './admin/assign-role-to-user/assign-role-to-user.component';
import { MenusComponent } from './admin/menus/menus.component';
import { SubMenusComponent } from './admin/sub-menus/sub-menus.component';
import { TreeMenuComponent } from './admin/tree-menu/tree-menu.component';
import { DashboardComponent } from './template1/dashboard/dashboard.component';
import { AccessControlComponent } from './admin/access-control/access-control.component';
import { Select2Module } from 'ng-select2-component';
import { CreateUserComponent } from './admin/create-user/create-user.component';
import {RoleEntryComponent} from "./admin/role-entry/role-entry.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchUserComponent } from './admin/search-user/search-user.component';
import { PieChartComponent } from './template1/charts/pie-chart/pie-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { ReportsRegistryComponent } from './admin/reports-registry/reports-registry.component';
import { ReportsComponent } from './template1/reports/reports.component';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { UserTableComponent } from './admin/user-table/user-table.component';
import { MLComponent } from './template1/ml/ml.component';
import { PredictComponent } from './template1/ml/predict/predict.component';
import { EvaluateComponent } from './template1/ml/evaluate/evaluate.component';
import { ProfileComponent } from './template1/profile/profile.component';
import { AccessLogComponent } from './template1/access-log/access-log.component';
import { ChangePasswordComponent } from './template1/change-password/change-password.component';
import { UserActivityTableComponent } from './template1/user-activity-table/user-activity-table.component';
import { ClaimDashboardComponent } from './executive-dashboard/claim-dashboard/claim-dashboard.component';
import { OperationsDashboardComponent } from './executive-dashboard/operations-dashboard/operations-dashboard.component';
import { FinancialDashboardComponent } from './executive-dashboard/financial-dashboard/financial-dashboard.component';
import {NgApexchartsModule} from "ng-apexcharts";
import { InteractiveDashboardComponent } from './executive-dashboard/interactive-dashboard/interactive-dashboard.component';
import { CommonInterfaceComponent } from './template1/common-interface/common-interface.component';
import { ToastContainerComponent } from './template1/toast-container/toast-container.component';
import {NgxSpinnerModule} from "ngx-spinner";
import { CaramelReportsComponent } from './caramel-reports/caramel-reports.component';
import { MotorRoadAccidentComponent } from './motor-road-accident/motor-road-accident.component';
import { FraudDetectionComponent } from './fraud-detection/fraud-detection.component';
import { RecruitmentSummaryComponent } from './executive-dashboard/interactive-dashboard/recruitment-summary/recruitment-summary.component';
import { AdhocReportComponent } from './adhoc-report/adhoc-report.component';
import { ViewReportComponent } from './adhoc-report/view-report/view-report.component';
import { DailySalesComponent } from './template1/dashboard/daily-sales/daily-sales.component';

@NgModule({
    imports: [CommonModule, HomeRoutingModule, SharedModule, Select2Module, NgChartsModule, NgApexchartsModule, NgxSpinnerModule],
    declarations: [
        HomeComponent,
        RoleMenuMappingComponent,
        AssignRoleToUserComponent,
        MenusComponent,
        SubMenusComponent,
        TreeMenuComponent,
        DashboardComponent,
        AccessControlComponent,
        CreateUserComponent,
        RoleEntryComponent,
        SearchUserComponent,
        PieChartComponent,
        ReportsRegistryComponent,
        ReportsComponent,
        UserManagementComponent,
        UserTableComponent,
        MLComponent,
        PredictComponent,
        EvaluateComponent,
        ProfileComponent,
        AccessLogComponent,
        ChangePasswordComponent,
        UserActivityTableComponent,
        ClaimDashboardComponent,
        OperationsDashboardComponent,
        FinancialDashboardComponent,
        InteractiveDashboardComponent,
        CommonInterfaceComponent,
        ToastContainerComponent,
        CaramelReportsComponent,
        MotorRoadAccidentComponent,
        FraudDetectionComponent,
        RecruitmentSummaryComponent,
        AdhocReportComponent,
        ViewReportComponent,
        DailySalesComponent,

    ],
    exports: [
        ToastContainerComponent
    ]
})
export class HomeModule {}
