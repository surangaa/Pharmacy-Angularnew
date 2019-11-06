import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ItemStockService } from 'src/app/shared/services/item-stock.service';
import { PurchaseService } from 'src/app/shared/services/purchase.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ItemService } from 'src/app/shared/services/item.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';

import {Chart} from 'chart.js';
import { SalesService } from 'src/app/shared/services/sales.service';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import 'rxjs/add/operator/map';
import { ChartsModule } from 'ng2-charts';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { LowstockService } from 'src/app/shared/services/lowstock.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  todaySales = '';
  monthSales = '';
  todayTransaction = 0;
  monthTransacrion = 0;

  public chartReady = false;

  public chartOptions = {
    title: {
      display: true,
      text: ' '
    }
  };
  public chartLabels = [];
  public chartType = 'line';
  public chartLegend = true;
  public chartData = [];
  public chartDataSales = {
    data: [],
    label: 'total sales'
  };
  public chartDataDiscounts = {
    data: [],
    label: 'total discounts'
  };

  chart = [];

  public pieChartOptions = {
    responsive: true,
  };
  public pieChartLabels = [];
  public pieChartData = [];
  public pieChartType = 'pie';

  public reporttable: any;
  itemstocks: any = [];
  transactions: any;
  purchases: any;
  sales: any = [];
  topItems: any = [];
  expiry: any = [];
  suppliers: any;
  lowstocks: any = [];

  constructor(
    private dashBoardService: DashboardService,
    private transactionService: TransactionService,
    private purchaseService: PurchaseService,
    private supplierService: SupplierService,
    private lowstock: LowstockService
  ) { }

  ngOnInit() {

    this.loadOthers();
    this.dashBoardService.getAll()
      .subscribe( (res: any) =>{
          this.todaySales = res.today_sales;
          this.monthSales = res.month_sales;
          this.todayTransaction = res.today_transactions;
          this.monthTransacrion = res.month_transactions;
          this.sales = res.last_month_sales_and_discounts;
          this.topItems = res.top_sold_items_this_week;
          this.expiry = res.expiry;
          this.createSalesChart();
          this.createPieChart();
      });
  }

  createSalesChart() {
    this.sales.forEach(sale => {
      this.chartLabels.push(sale.db_date);
      this.chartDataSales.data.push(sale.total_sales);
      this.chartDataDiscounts.data.push(sale.total_discount);
    });

    this.chartData.push(
      this.chartDataSales,
      this.chartDataDiscounts
    )
    this.chartReady = true;
  }

  createPieChart() {
    this.topItems.forEach(item => {
      this.pieChartLabels.push(item.item_name);
      this.pieChartData.push(item.item_sales);
    });
    this.chartReady = true;
  }

  loadOthers() {
  this.transactionService.getAll().subscribe(
    transactionData => {
      this.transactions = transactionData;
    }
  );
    this.lowstock.getAll().subscribe(
        lowstockdrugData => {
          console.log('hiii');
          console.log(lowstockdrugData);
          this.lowstocks = lowstockdrugData;
        }
      );
      this.supplierService.getAll().subscribe(
        supplierData => {
          this.suppliers = supplierData;
        }
      );
    this.purchaseService.getAll().subscribe(
      purchaseData => {
        this.purchases = purchaseData;
      }
    );
  }

  // getSupplierName(id) {
  //   const supplier = this.suppliers.find(supplier => +supplier.id === +id);
  //   return supplier.supplier;
  // }

}
