// Angular modules
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

// Components
import { NotFoundComponent } from './static/not-found/not-found.component';
import { LoginComponent } from './pages/auth/auth/login/login.component';
import { AuthGuard } from "@helpers/authguard.guard";
import { DashboardComponent } from "./pages/home/template1/dashboard/dashboard.component";
import { AccessControlComponent } from "./pages/home/admin/access-control/access-control.component";
import { MenusComponent } from "./pages/home/admin/menus/menus.component";
import { SubMenusComponent } from "./pages/home/admin/sub-menus/sub-menus.component";
import { RoleEntryComponent } from "./pages/home/admin/role-entry/role-entry.component";
import { DataTableComponent } from '@blocks/data-table/data-table.component';
import { ReportsComponent } from "./pages/home/template1/reports/reports.component";
import { ReportsRegistryComponent } from "./pages/home/admin/reports-registry/reports-registry.component";
import { UserManagementComponent } from './pages/home/admin/user-management/user-management.component';
import { MLComponent } from "./pages/home/template1/ml/ml.component";
import { PermissionGuard } from '@helpers/permission.guard';
import { ProfileComponent } from "./pages/home/template1/profile/profile.component";
import { AccessLogComponent } from './pages/home/template1/access-log/access-log.component';
import {ChangePasswordComponent} from "./pages/home/template1/change-password/change-password.component";
import { HomeComponent } from './pages/home/home.component';
import {ClaimDashboardComponent} from "./pages/home/executive-dashboard/claim-dashboard/claim-dashboard.component";
import {OperationsDashboardComponent} from "./pages/home/executive-dashboard/operations-dashboard/operations-dashboard.component";
import {FinancialDashboardComponent} from "./pages/home/executive-dashboard/financial-dashboard/financial-dashboard.component";
import {
  InteractiveDashboardComponent
} from "./pages/home/executive-dashboard/interactive-dashboard/interactive-dashboard.component";
import {UserActivityTableComponent} from "./pages/home/template1/user-activity-table/user-activity-table.component";
import { CommonInterfaceComponent } from './pages/home/template1/common-interface/common-interface.component';
import { CaramelReportsComponent } from './pages/home/caramel-reports/caramel-reports.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
  },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'dashboard-general', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'dashboard/claim', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard] },
  { path: 'dashboard/operations', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard] },
  { path: 'dashboard/financial', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard] },
  { path: 'dashboard/interactive', component: InteractiveDashboardComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard] },
  { path: 'admin/access-control', component: AccessControlComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'admin/menus', component: MenusComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'admin/all-user-activity', component: UserActivityTableComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  // { path: 'dataTable', component: DataTableComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard] },
  { path: 'admin/sub-menus', component: SubMenusComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'admin/user-management', component: UserManagementComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'admin/role-entry', component: RoleEntryComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard] },
  // { path: 'admin/reports', component: ReportsComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard] },
  { path: 'admin/reports-registry', component: ReportsRegistryComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard] },
  { path: 'analytics/claim-analytics', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'analytics/actuarial-analytics', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'analytics/sales-investigation', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'analytics/marketing', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'analytics/insurance-underwriting', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'analytics/insurance-finance', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'analytics/cash-flow-management', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'motor-road-accident/accident-analysis', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard]},
  { path: 'fraud-detection/fraudulent-activity-analysis', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard]},
  { path: 'report/ranking-report', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard]},
  { path: 'report/interactive-report', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard]},
  { path: 'report/operational-report', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard]},
  { path: 'report/adhoc-report', component: CommonInterfaceComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard]},
  { path: 'caramel-report/caramel-dashboard', component: CaramelReportsComponent, pathMatch: 'full', canActivate: [AuthGuard, PermissionGuard]},
  { path: 'my-account/profile', component: ProfileComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'activity-log', component: AccessLogComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'activity-log-admin', component: AccessLogComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '**', component: NotFoundComponent }
  { path: '**', component: HomeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
