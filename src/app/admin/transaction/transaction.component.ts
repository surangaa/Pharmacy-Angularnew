import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ItemService } from 'src/app/shared/services/item.service';
import TransactionItem from 'src/app/models/transactionItem';
import { NgForm, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ToastrService } from 'ngx-toastr';

declare var $;
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PurchaseService } from 'src/app/shared/services/purchase.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { ItemStockService } from 'src/app/shared/services/item-stock.service';
import { Item } from 'src/app/models/item.model';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { AppError } from 'src/app/shared/errors/app-error';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})

export class TransactionComponent implements OnInit {
  transactions: any = [];
  @ViewChild('transactionTable') Table;
  public dataTableItem: any;
  buttonValue: string;
  items: any = [];
  suppliers: any = [];
  stocks: any = [];
  itemstocks: any = [];
  currentTransactionId: any;
  @ViewChild('content') content: ElementRef;
  nestedForm: FormGroup;

  currentTotal = 0;
  currentDiscount = 0;
  currentGrandTotal = 0;
  currentChange = 0;
  currentPaid = 0;

  selectedItems: any = [];

  constructor(
    private _fb: FormBuilder,
    private itemService: ItemService,
    // private purchaseService: PurchaseService,
    private transactionService: TransactionService,
    private supplierService: SupplierService,
    private itemstockService: ItemStockService,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.buttonValue = 'Add Receipt';
    this.loadOthers();
    this.loadTransactions();
    this.nestedForm = this._fb.group({
      itemId: [null, Validators.required],
      quantity: [null, Validators.required],
    });
  }

  getItemPrice(item, quantity) {
    const itemStock = this.itemstocks.find(itemstock => +itemstock.id === +item);
    const unitPrice = itemStock.unitPrice;
    const quantityInt = +quantity;
    if (item && quantity) {
      return (unitPrice * quantityInt);
    }
    return undefined;
  }

  getTotalPrice() {
    let totalPrice = 0;
    this.selectedItems.forEach(item => {

      totalPrice += this.getItemPrice(item.itemId, item.quantity);
    });
    this.currentTotal = totalPrice;
    return totalPrice;
  }

  getDiscountAmount() {
    if (this.currentDiscount > 100) {
      return 0;
    }
    return (this.currentTotal * this.currentDiscount) / 100;
  }

  getGrandTotal() {
    return this.currentTotal - this.getDiscountAmount();
  }

  getCurrentChange() {
    if (this.currentPaid > this.getGrandTotal()) {
      return this.currentPaid - this.getGrandTotal();
    }
    return 0;
  }

  getItemName(item) {
    const itemStock = this.itemstocks.find(itemstock => +itemstock.id === +item);
    return itemStock.Name;
  }

  addItem() {
    this.selectedItems.push(this.nestedForm.value);
    this.resetTransactionForm();
  }

  deleteFromSelectedItem(index) {
    this.selectedItems.splice(index, 1);
  }

  formStatus() {
    return this.selectedItems.length < 1 || (this.currentPaid < this.getGrandTotal());
  }

  resetTransactionForm() {
    this.nestedForm.reset();
    this.currentTotal = 0;
    this.currentDiscount = 0;
    this.currentGrandTotal = 0;
    this.currentChange = 0;
    this.currentPaid = 0;
  }

  resetTransactionFormFull() {
    this.nestedForm.reset();
    this.selectedItems = [];
  }

  loadTransactions() {
    if ($.fn.DataTable.isDataTable(this.Table.nativeElement)) {
      $(this.Table.nativeElement).dataTable().fnDestroy();
    }
    this.transactionService.getAll().subscribe(
      transactionsData => {
        this.transactions = transactionsData;
        console.log(this.transactions);
        this.dataTableItem = $(this.Table.nativeElement);
        setTimeout(() => {
          this.dataTableItem.DataTable();
        }, 1);
      }, (_err) => {
      }, () => {
      }
    );
  }

  loadOthers() {

    this.itemstockService.getAll().subscribe(
      itemstockData => {
        this.itemstocks = itemstockData;
        console.log('item stock data');
        console.log(itemstockData);
      }
    );

    this.itemService.getAll().subscribe(
      itemsData => {
        this.items = itemsData;
        console.log('itemsData');
        console.log(itemsData);
      }
    );

    this.supplierService.getAll().subscribe(
      suppplierData => {
        this.suppliers = suppplierData;
        console.log('suppplierData');
        console.log(suppplierData);
      }
    );
  }

  submitHandler() {
    if (this.buttonValue === 'Add Receipt') {
      this.transactionService.create({
        'discount_percentage': this.currentDiscount,
        'discount_price': this.getDiscountAmount(),
        'total': this.currentTotal,
        'grand_total': this.getGrandTotal(),
        'selectedItems': this.selectedItems
      }).subscribe(
        (_result) => {
          this.resetTransactionFormFull();
          this.loadOthers();
          this.loadTransactions();
          this.toastr.success('Transaction created Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Transaction creation Failed');
        }
      );
    } else {
      this.transactionService.update(this.nestedForm.value, this.nestedForm.value.id).subscribe(_result => {
        this.resetTransactionFormFull();
        this.loadOthers();
        this.loadTransactions();
      });
    }
  }

  updateItem(id) {
    this.buttonValue = 'Edit Receipt';
    this.transactionService.getById(id).subscribe((transaction: any) => {
      this.currentTransactionId = transaction.id;
      console.log('transaction');
      console.log(transaction);
    });
  }


  public generatePDF() {
    const pdf = new jspdf();
    pdf.setFontSize(20);
    pdf.setTextColor(40);
    pdf.setFontStyle('normal');
    pdf.text(50, 60, 'Weerasiri Pharmacy');
    pdf.setFontSize(18);
    pdf.text(50, 70, '33/A,Kirillawala,Kadawatha T.P:0112345672');
    const print = document.getElementById('contentToConvert');
    html2canvas(print).then(canvas => {
      // const pdf = new jspdf();
      // pdf.text(50, 10, 'Weerasiri Pharmacy - Demand for the drugs Report');
      // pdf.text(10, 20, '33/A,Kirillawala,Kadawatha T.P:0112345672');

      // Few necessary setting options
      // tslint:disable-next-line:prefer-const
      let imgWidth = 150;
      const pageHeight = 200;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
    // A4 size page of PDF
      const position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, pageHeight, heightLeft);

      pdf.save('receipt.pdf'); // Generated PDF
      //   printDoc.autoPrint();
      // printDoc.output('dataurlnewwindow');

    });

    

  }




}






