import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ItemService } from 'src/app/shared/services/item.service';
import { GenericService } from 'src/app/shared/services/generic.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { PackService } from 'src/app/shared/services/pack.service';
import { Item } from 'src/app/models/item.model';
import { PurchaseService } from 'src/app/shared/services/purchase.service';
import { AppError } from 'src/app/shared/errors/app-error';
import { BadInput } from 'src/app/shared/errors/bad-input';
import { NotFoundError } from 'src/app/shared/errors/not-found-error';
import { ItemStockService } from 'src/app/shared/services/item-stock.service';
import { ToastrService } from 'ngx-toastr';

declare var $;

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  types: Item[] = [
    { id: 1, type: 'medicinal drugs' },
    { id: 2, type: 'over-the-counter items' },
  ];
  public items: any = [];
  public generics: any = [];
  public categories: any = [];
  public packs: any = [];
  public suppliers: any = [];
  public purchases: any = [];
  public itemstocks: any = [];
  @ViewChild('itemsTable') Table;
  @ViewChild('f') itemForm: NgForm;
  @ViewChild('file') imageInput: ElementRef;
  public dataTableItem: any;
  result: any;
  currentItem: number;
  buttonValue: string;
  item = {
    name: '',
    genericName: '',
    categoryName: '',
    itemType: '',
    packType: '',
    packSize: '',
    supplierName: '',
    notifyAt: '',
    productImage: '',

  };
  public imagePath;
  imgURL: any;
  public message: string;
  public productBaseURL = 'http://127.0.0.1:8000/images/products/';
  public defaultImage = 'product-default.jpg';
  public newImage = null;
  public currentDeleteItem = null;
  @ViewChild('itemDeleteModal') itemDeleteModal: ElementRef;

  constructor(
    private itemService: ItemService,
    private genericService: GenericService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private packService: PackService,
    private purchaseService: PurchaseService,
    private itemstockService: ItemStockService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.buttonValue = 'Add';
    this.loadOthers();
    this.loadItems();
  }

  loadOthers() {
    this.genericService.getAll().subscribe(
      genericsData => {
        console.log(genericsData);
        this.generics = genericsData;
      }
    );

    this.categoryService.getAll().subscribe(
      categoryData => {
        this.categories = categoryData;
      }
    );

    this.supplierService.getAll().subscribe(
      supplierData => {
        console.log(supplierData);
        this.suppliers = supplierData;
      }
    );

    this.packService.getAll().subscribe(
      packsData => {
        console.log(packsData);
        this.packs = packsData;
      }
    );

    this.purchaseService.getAll().subscribe(
      purchaseData => {
        console.log(purchaseData);
        this.purchases = purchaseData;
      }
    );

    this.itemstockService.getAll().subscribe(
      stockData => {
        console.log(stockData);
        this.itemstocks = stockData;
      }
    );
  }

  loadItems() {
    if ($.fn.DataTable.isDataTable(this.Table.nativeElement)) {
      $(this.Table.nativeElement).dataTable().fnDestroy();
    }
    this.itemService.getAll().subscribe(
      itemsData => {
        this.items = itemsData;
        console.log(this.items);
        this.dataTableItem = $(this.Table.nativeElement);
        setTimeout(() => {
          this.dataTableItem.DataTable();
        }, 1);
      }, (err) => {
      }, () => {
      }
    );
  }

  getUnitsleft(item) {
    console.log('unitsleft');
    console.log(this.itemstocks.units_left);
    const itemStock = this.itemstocks.find(itemstock => +itemstock.id === +item);
    return itemStock.units_left;
  }

  onSubmit() {
    // console.log(this.itemForm);
    this.item.name = this.itemForm.value.item;
    this.item.genericName = this.itemForm.value.genericName;
    this.item.categoryName = this.itemForm.value.categoryName;
    this.item.itemType = this.itemForm.value.itemType;
    this.item.packType = this.itemForm.value.packType;
    this.item.packSize = this.itemForm.value.packSize;
    this.item.supplierName = this.itemForm.value.supplierName;
    this.item.notifyAt = this.itemForm.value.notifyAt;

    if (this.newImage) {
      this.item.productImage = this.imgURL;
    } else {
      this.item.productImage = '';
    }
    this.saveItemToServer(this.item);
  }

  saveItemToServer(item) {
    if (this.buttonValue === 'Add') {
      this.itemService.create(item)
        .subscribe(
          response => {
            this.resetItemForm();
            this.loadItems();
            this.toastr.success('Item created Successfully');
          },
          (error: AppError) => {
            this.toastr.error('Item creation Failed');
          });
    } else {
      this.itemService.update(item, this.currentItem).subscribe(
        (result) => {
          this.resetItemForm();
          this.loadItems();
          this.toastr.success('Item updated Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Item update Failed');
        }
      );
    }
  }

  updateItem(id) {
    this.buttonValue = 'Edit';
    this.itemService.getById(id).subscribe((result: any) => {
      this.currentItem = result.id;
      if (result.src) {
        this.imgURL = this.productBaseURL + result.src;
      } else {
        this.imgURL = this.productBaseURL + this.defaultImage;
      }

      console.log(result);
      this.itemForm.setValue({
        item: result.Name,
        genericName: +result.Generic_Name,
        categoryName: +result.Category_Name,
        itemType: +result.Item_Type,
        packType: +result.Pack_Type,
        packSize: result.Pack_Size,
        supplierName: +result.Supplier_Name,
        notifyAt: +result.notify_at,
      });
    });
  }

  resetItemForm() {
    this.buttonValue = 'Add';
    this.itemForm.reset();
    this.imagePath = '';
    this.imgURL = '';
    this.imageInput.nativeElement.value = '';
    this.newImage = null;
  }

  deleteItemConfirm(item) {
    this.currentDeleteItem = item;
    $(this.itemDeleteModal.nativeElement).modal('show');
  }

  deleteItem() {
    const item = this.currentDeleteItem;
    this.itemService.delete(item.id)
      .subscribe(
        (response) => {
          this.loadItems();
          this.toastr.success('Item deleted Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Item deletion Failed');
          if (error instanceof NotFoundError) {
            alert('This post has been already deleted.')
          } else { throw error; }
        });
    $(this.itemDeleteModal.nativeElement).modal('hide');
  }

  preview(files) {
    if (files.length === 0) {
      return 0;
    }
    // tslint:disable-next-line:prefer-const
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.newImage = reader.result;
    };
  }

  getSupplierName(supplierObj) {
    // tslint:disable-next-line:no-shadowed-variable
    const supplier = this.suppliers.find(supplier => +supplier.id === +supplierObj.Supplier_Name);
    return supplier.supplier;
  }

  getPacksize(packObj) {
    const pack = this.packs.find(pack => +pack.id === +packObj.Pack_Type);
    return pack.name;
  }

  // getUnitsleft(id) {
  //   const itemstocks = this.itemstocks.find(this.itemstocks => +item.id === +id);
  //   return itemstocks.units_left;
  // }

  // getUnitsleft(index) {
  //   const itemstock = this.itemstocks.find(itemstock => +itemstock.id === +Item);
  //     return itemstock.units_left;
  //   }

}
