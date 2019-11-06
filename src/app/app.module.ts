import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { ChartsModule } from 'ng2-charts-x';
// import { NgxSpinnerModule } from 'ngx-spinner';
import * as jspdf from 'jspdf';
import { ToastrModule } from 'ngx-toastr';


import html2canvas from 'html2canvas';

import { AppComponent } from './app.component';
import { GuestComponent } from './guest/guest.component';
import { AdminComponent } from './admin/admin.component';
import { NavbarComponent } from './admin/navbar/navbar.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { HomeComponent } from './guest/home/home.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CategoryComponent } from './admin/category/category.component';
import { GenericComponent } from './admin/generic/generic.component';
import { PackComponent } from './admin/pack/pack.component';
import { ItemComponent } from './admin/item/item.component';
import { SupplierComponent } from './admin/supplier/supplier.component';


import * as $ from 'jquery';

import { GenericService } from './shared/services/generic.service';
import { StaffComponent } from './admin/staff/staff.component';
import { PurchaseComponent } from './admin/purchase/purchase.component';
import { TransactionComponent } from './admin/transaction/transaction.component';
import { LoginadminComponent } from './admin/loginadmin/loginadmin.component';
import { NavbarguestComponent } from './guest/navbarguest/navbarguest.component';

import { AppErrorHandler } from './shared/errors/app-error-handler';
import { ProfileComponent } from './admin/profile/profile.component';
import { AuthService } from './shared/services/auth.service';
import { InterceptTokenService } from './shared/services/intercept-token.service';
import { GuardAuthService } from './shared/services/guard-auth.service';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { NgSelectModule } from '@ng-select/ng-select';
import { ReportComponent } from './admin/report/report.component';
import { SalesComponent } from './admin/report/Sales/Sales.component';
import { EmployeeperformanceComponent } from './admin/report/employeeperformance/employeeperformance.component';
import { DrugdemandComponent } from './admin/report/drugdemand/drugdemand.component';
import { SalesService } from './shared/services/sales.service';

import { LowStockComponent } from './admin/report/lowStock/lowStock.component';
import { ExpiringDrugComponent } from './admin/report/expiringDrug/expiringDrug.component';
import { UserProfileComponent } from './admin/user-profile/user-profile.component';
import { ReturnSalesComponent } from './admin/return-sales/return-sales.component';
import { AboutusComponent } from './guest/aboutus/aboutus.component';
import { StockDeleteComponent } from './admin/stock-delete/stock-delete.component';



export function tokenGetter() {
   return localStorage.getItem('access_token');
 }

@NgModule({
   declarations: [
      AppComponent,
      GuestComponent,
      AdminComponent,
      NavbarComponent,
      SidebarComponent,
      HomeComponent,
      ErrorPageComponent,
      DashboardComponent,
      CategoryComponent,
      GenericComponent,
      PackComponent,
      ItemComponent,
      SupplierComponent,
      StaffComponent,
      PurchaseComponent,
      TransactionComponent,
      LoginadminComponent,
      NavbarguestComponent,
      ProfileComponent,
      ReportComponent,
      SalesComponent,
      EmployeeperformanceComponent,
      DrugdemandComponent,
      LowStockComponent,
      ExpiringDrugComponent,
      UserProfileComponent,
      ReturnSalesComponent,
      AboutusComponent,
      StockDeleteComponent

   ],
   schemas: [
      CUSTOM_ELEMENTS_SCHEMA
   ],
   imports: [
      ChartsModule,
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      NgSelectModule,
      FormsModule,
      ReactiveFormsModule,
      AngularFontAwesomeModule,
      BrowserAnimationsModule,
      JwtModule.forRoot({
         config: {
           tokenGetter: tokenGetter,
           authScheme: 'JWT'
         }
       }),
      //  NgxSpinnerModule,
       ToastrModule.forRoot({
         timeOut: 10000,
         positionClass: 'toast-bottom-right',
         preventDuplicates: true
       })
   ],
   providers: [
      SalesService,
      GuardAuthService,
      AuthService,
      {
         provide: HTTP_INTERCEPTORS,
         useClass: InterceptTokenService,
         multi: true
       },
      // { provide: ErrorHandler, useClass: AppErrorHandler }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
