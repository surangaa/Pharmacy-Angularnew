import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './guest/home/home.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { CategoryComponent } from './admin/category/category.component';
import { GenericComponent } from './admin/generic/generic.component';
import { PackComponent } from './admin/pack/pack.component';
import { ItemComponent } from './admin/item/item.component';
import { SupplierComponent } from './admin/supplier/supplier.component';
import { AdminComponent } from './admin/admin.component';
import { StaffComponent } from './admin/staff/staff.component';
import { PurchaseComponent } from './admin/purchase/purchase.component';
import { TransactionComponent } from './admin/transaction/transaction.component';
import { LoginadminComponent } from './admin/loginadmin/loginadmin.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { GuardAuthService } from './shared/services/guard-auth.service';
import { RoleGuardService } from './shared/services/role-guard.service';
import { ReportComponent } from './admin/report/report.component';
import { SalesComponent } from './admin/report/Sales/Sales.component';
import { EmployeeperformanceComponent } from './admin/report/employeeperformance/employeeperformance.component';
import { DrugdemandComponent } from './admin/report/drugdemand/drugdemand.component';
import { LowStockComponent } from './admin/report/lowStock/lowStock.component';
import { ExpiringDrugComponent } from './admin/report/expiringDrug/expiringDrug.component';
import { UserProfileComponent } from './admin/user-profile/user-profile.component';
import { ReturnSalesComponent } from './admin/return-sales/return-sales.component';
import { AboutusComponent } from './guest/aboutus/aboutus.component';
import { StockDeleteComponent } from './admin/stock-delete/stock-delete.component';



const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'aboutus', component: AboutusComponent},
  // { path: 'details', component: DetailsComponent },
  { path: 'login', component: LoginadminComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [GuardAuthService]
      },
      {
        path: 'userprofile',
        component: UserProfileComponent,
        canActivate: [GuardAuthService]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [GuardAuthService],
        data: {
          expectedRole: 'manager'
        }
      },
      {
        path: 'category',
        component: CategoryComponent,
        canActivate: [GuardAuthService]
      },
      {
        path: 'stock',
        component: StockDeleteComponent,
        canActivate: [GuardAuthService]
      },
      {
        path: 'generic',
        component: GenericComponent,
        canActivate: [GuardAuthService]
      },
      {
        path: 'pack',
        component: PackComponent,
        canActivate: [GuardAuthService]
      },
      {
        path: 'item',
        component: ItemComponent,
        canActivate: [GuardAuthService]
      },
      {
        path: 'supplier',
        component: SupplierComponent,
        canActivate: [GuardAuthService]
      },
      {
        path: 'staff',
        component: StaffComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'manager'
        }
      },
      {
        path: 'purchase',
        component: PurchaseComponent,
        canActivate: [GuardAuthService]
      },
      {
        path: 'returnsales',
        component: ReturnSalesComponent,
        canActivate: [GuardAuthService]
      },
      // {
      //   path: 'user',
      //   component: UserComponent,
      //   canActivate: [GuardAuthService]
      // },
      {
        path: 'reports',
        component: ReportComponent,
        canActivate: [RoleGuardService],
        children: [
          { path: 'sales',
           component: SalesComponent,
           },
          { path: 'performances',
           component: EmployeeperformanceComponent,
           },
          { path: 'drugdemands',
           component: DrugdemandComponent,
          },
          { path: 'expires',
           component: ExpiringDrugComponent,
           },
          {
            path: 'lowstocks',
            component: LowStockComponent,
          },
        ],
        data: {
          expectedRole: 'manager'
        }
      },
      {
        path: 'transaction',
        component: TransactionComponent,
        canActivate: [GuardAuthService],
      },
    ]
  },
  { path: 'not-found', component: ErrorPageComponent, data: {message: 'Page not found!'} },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoutes, {useHash: true})
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
