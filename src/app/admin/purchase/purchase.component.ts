import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ItemService } from 'src/app/shared/services/item.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import PurchaseItem from 'src/app/models/purchaseItem';
import { ToastrService } from 'ngx-toastr';

declare var $;

import { PurchaseService } from 'src/app/shared/services/purchase.service';
import { PackService } from 'src/app/shared/services/pack.service';
import { ItemStockService } from 'src/app/shared/services/item-stock.service';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { AppError } from 'src/app/shared/errors/app-error';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  submitted = false;

  purchases: any = [];
  @ViewChild('purchaseTable') Table;
  public dataTableItem: any;
  buttonValue = 'Add';
  // buttonValue: string = 'Add';
  suppliers: any = [];
  packs: any = [];
  items: any = [];
  itemstocks: any = [];
  nestedForm: FormGroup;
  currentPurchaseId: any;
  constructor(
    private _fb: FormBuilder,
    private itemService: ItemService,
    private supplierService: SupplierService,
    private purchaseService: PurchaseService,
    private packService: PackService,
    private itemstockService: ItemStockService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.submitted = true;
    this.buttonValue = 'Add';
    this.loadOthers();
    this.loadPurchases();
    this.nestedForm = this._fb.group({
      id: [null],
      supplierInvoiceNo: [null, Validators.required],
      supplier: [null, Validators.required],
      remarks: [null],
      selectedItems: this._fb.array([this.addItemsGroup()])
    });
  }

  addItemsGroup() {
    return this._fb.group({
      batchId: [null, Validators.required],
      itemId: [null, Validators.required],
      expiryDate: [null, Validators.required],
      costPrice: [null, Validators.required],
      retailPrice: [null, Validators.required],
      quantity: [null, Validators.required],
      code: [{ value: 'Code will generate after submitting', disabled: true }],
    });
  }

  getUnitPrice(index) {
    const retailPrice = this.selectedItems.value[index].retailPrice;
    const itemId = this.selectedItems.value[index].itemId;
    const item = this.items.find(item => +item.id === +itemId);

    if (retailPrice && item) {
      return +retailPrice / item.Pack_Size;
    }
    return undefined;
  }

  get selectedItems() {
    return <FormArray>this.nestedForm.get('selectedItems');
  }

  addSelectedItem() {
    this.selectedItems.push(this.addItemsGroup());
  }

  removeSelectedItem(index) {
    if (this.selectedItems.length > 1) {
      this.selectedItems.removeAt(index);
    }
  }

  get supplierInvoiceNo() {
    return this.nestedForm.get('supplierInvoiceNo');
  }

  get supplier() {
    return this.nestedForm.get('supplier');
  }

  get remarks() {
    return this.nestedForm.get('remarks');
  }

  resetPurchaseForm() {
    this.buttonValue = 'Add';
    this.nestedForm.reset();
    this.nestedForm.setControl('selectedItems', this._fb.array([this.addItemsGroup()]));
  }

  submitHandler() {

    console.log('form values');
    console.log(this.nestedForm.value);
    if (this.buttonValue === 'Add') {
      if (this.nestedForm.valid) {
        this.purchaseService.create(this.nestedForm.value).subscribe(
          (result) => {
            this.resetPurchaseForm();
            this.loadOthers();
            this.loadPurchases();
            this.toastr.success('Purchase created Successfully');
          },
          (error: AppError) => {
            this.toastr.error('Purchase insert Failed');
          }
        );
      }
    } else {
      if (this.nestedForm.valid) {
        this.purchaseService.update(this.nestedForm.value, this.nestedForm.value.id).subscribe(
          (result) => {
            this.resetPurchaseForm();
            this.loadOthers();
            this.loadPurchases();
            this.toastr.success('Purchase updated Successfully');
          },
          (error: AppError) => {
            this.toastr.error('Purchase update Failed');
          }
        );
      }
    }

  }

  getSupplierName(id) {
    const supplier = this.suppliers.find(supplier => +supplier.id === +id);
    return supplier.supplier;
  }

  getTotalPrice() {
    let totalPrice = 0;
    this.selectedItems.value.forEach(item => {
      if (item.costPrice && item.quantity) {
        totalPrice += item.costPrice * item.quantity;
      }
    });
    return totalPrice;
  }

  loadPurchases() {
    if ($.fn.DataTable.isDataTable(this.Table.nativeElement)) {
      $(this.Table.nativeElement).dataTable().fnDestroy();
    }
    this.purchaseService.getAll()
      .subscribe(
        response => {
          this.purchases = response;
          this.dataTableItem = $(this.Table.nativeElement);
          setTimeout(() => {
            this.dataTableItem.DataTable();
          }, 1);
        },
        (error: Response) => {
          console.log(error);
        }
      );
  }

  loadOthers() {
    this.supplierService.getAll().subscribe(
      supplierData => {
        this.suppliers = supplierData;
      }
    );

    this.itemstockService.getAll().subscribe(
      itemstockData => {
        this.itemstocks = itemstockData;
      }
    );

    this.itemService.getAll().subscribe(
      itemsData => {
        this.items = itemsData;
      }
    );

    this.packService.getAll().subscribe(
      packsData => {
        this.packs = packsData;
      }
    );
  }

  deletePurchase(purchase) {
    if (confirm('Are you sure to delete?')) {
      this.purchaseService.delete(purchase.id).subscribe(
        (result: any) => {
          this.loadPurchases();
          this.toastr.success('Purchase deleted Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Purchase deletion Failed');
        }
      );
    }
  }

  updateItem(id) {
    this.buttonValue = 'Edit';
    this.purchaseService.getById(id).subscribe((purchase: any) => {
      this.currentPurchaseId = purchase.id;
      this.nestedForm.patchValue({
        id: purchase.id,
        supplierInvoiceNo: purchase.supplierInvoiceNo,
        supplier: purchase.supplier,
        remarks: purchase.remarks
      });
      this.nestedForm.setControl('selectedItems', this.setSelectedItems(purchase.selectedItems));
    });
  }

  setSelectedItems(items) {
    const formArray = new FormArray([]);
    items.forEach(item => {
      console.log('item', item);
      formArray.push(this._fb.group({
        batchId: [item.batchId, Validators.required],
        itemId: [item.itemId, Validators.required],
        expiryDate: [item.expiryDate, Validators.required],
        costPrice: [item.costPrice, Validators.required],
        retailPrice: [item.retailPrice, Validators.required],
        quantity: [item.quantity, Validators.required],
        code: [{ value: item.code, disabled: true }]
      }));
    });

    return formArray;
  }


}
