import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemStockService } from 'src/app/shared/services/item-stock.service';
import { AppError } from 'src/app/shared/errors/app-error';
import { ToastrService } from 'ngx-toastr';

declare var $;
@Component({
  selector: 'app-stock-delete',
  templateUrl: './stock-delete.component.html',
  styleUrls: ['./stock-delete.component.css']
})
export class StockDeleteComponent implements OnInit {
  @ViewChild('stockTable') Table;
  public dataTableStock: any;
  public stocks: any = [];

  constructor(private itemstock: ItemStockService,
     private toastr: ToastrService
    ) { }

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    if ($.fn.DataTable.isDataTable(this.Table.nativeElement)) {
      $(this.Table.nativeElement).dataTable().fnDestroy();
    }
    this.itemstock.getAll().subscribe(
      stockData => {
        console.log(stockData);

        this.stocks = stockData;
        this.dataTableStock = $(this.Table.nativeElement);
        setTimeout(() => {
          this.dataTableStock.DataTable();
        }, 1);
      }, (err) => {
      }, () => {
      }
    );
  }

  deleteStock(stock) {
    if (confirm('Are you sure to delete ' + stock.batchId)) {
      this.itemstock.delete(stock.id).subscribe(
        (result: any) => {
          this.loadStocks();
          this.toastr.success('Stock deleted Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Stock deletion Failed');
        }
      );
    }
  }
}
