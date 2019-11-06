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
  selector: 'app-return-sales',
  templateUrl: './return-sales.component.html',
  styleUrls: ['./return-sales.component.css']
})

export class ReturnSalesComponent implements OnInit {
  transactions: any = [];
  // @ViewChild('transactionTable') Table;
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

  selectedItems: any = [];

  constructor(
    private _fb: FormBuilder,
    private itemService: ItemService,
    private purchaseService: PurchaseService,
    private transactionService: TransactionService,
    private supplierService: SupplierService,
    private itemstockService: ItemStockService,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.buttonValue = 'Correct Transaction';
    this.loadOthers();
    // this.loadTransactions();
    this.nestedForm = this._fb.group({
      itemId: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
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

  getGrandTotal() {
    return this.currentTotal + +(this.currentDiscount);
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
    return this.selectedItems.length < 1;
  }

  resetTransactionForm() {
    this.nestedForm.reset();
    this.currentTotal = 0;
    this.currentDiscount = 0;
    this.currentGrandTotal = 0;
  }

  resetReturnTransactionFormFull() {
    this.nestedForm.reset();
    this.selectedItems = [];
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
    this.transactionService.createReturnTransaction({
      'discount_price': this.currentDiscount,
      'grand_total': this.getGrandTotal(),
      'selectedItems': this.selectedItems
    }).subscribe(
      (_result) => {
        this.resetReturnTransactionFormFull();
        this.loadOthers();
        // this.loadTransactions();
        this.toastr.success('Correction created Successfully');
      },
      (error: AppError) => {
        this.toastr.error('Correction creation Failed');
      }
    );

  }







}







