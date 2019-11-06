import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { AppError } from 'src/app/shared/errors/app-error';
import { ConflictState } from 'src/app/shared/errors/conflict-state';

declare var $;

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  public suppliers: any = [];
  @ViewChild('suppliersTable') Table;
  public dataTableSupp: any;
  buttonValue = 'Add';
  currentSupplier: number;
  supplier = {
    name: '',
    code: '',
    street: '',
    city: '',
    supplierPerson: '',
    supplierContact: ''

  };

  @ViewChild('f') supplierForm: NgForm;

  constructor(
    private suppliersService: SupplierService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.buttonValue = 'Add';
    this.loadSuppliers();
  }

  loadSuppliers() {
    if ($.fn.DataTable.isDataTable(this.Table.nativeElement)) {
      $(this.Table.nativeElement).dataTable().fnDestroy();
    }
    this.suppliersService.getAll().subscribe(
      supplierData => {
        this.suppliers = supplierData;
        this.dataTableSupp = $(this.Table.nativeElement);
        setTimeout(() => {
          this.dataTableSupp.DataTable();
        }, 1);
      }, (err) => {
      }, () => {
      }
    );
  }

  onSubmit() {
    this.supplier.name = this.supplierForm.value.supplier;
    this.supplier.code = this.supplierForm.value.code;
    this.supplier.street = this.supplierForm.value.street;
    this.supplier.city = this.supplierForm.value.city;
    this.supplier.supplierPerson = this.supplierForm.value.supplierPerson;
    this.supplier.supplierContact = this.supplierForm.value.supplierContact;
    this.saveSupplierToServer(this.supplier);
  }

  saveSupplierToServer(supplier) {
    if (this.buttonValue === 'Add') {
      this.suppliersService.create(supplier).subscribe(
        (result) => {
          this.resetSupplierForm();
          this.loadSuppliers();
          this.toastr.success('Supplier created Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Supplier creation Failed');
        }
      );
    } else {
      this.suppliersService.update(supplier, this.currentSupplier).subscribe(
        (result) => {
          this.resetSupplierForm();
          this.loadSuppliers();
          this.toastr.success('Supplier updated Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Supplier update Failed');
        }
      );
    }
  }

  updateSupplier(id) {
    this.buttonValue = 'Edit';
    this.suppliersService.getById(id).subscribe((result: any) => {
      console.log(result);
      this.currentSupplier = result.id;
      this.supplierForm.setValue({
        supplier: result.supplier,
        code: result.code,
        street: result.street,
        city: result.city,
        supplierPerson: result.supplier_person,
        supplierContact: result.contact
      });
    });
  }

  resetSupplierForm() {
    this.buttonValue = 'Add';
    this.supplierForm.reset();
  }

  deleteSupplier(supplier) {
    if (confirm('Are you sure to delete ' + supplier.supplier )) {
      this.suppliersService.delete(supplier.id).subscribe(
        (result: any) => {
          this.loadSuppliers();
          this.toastr.success('Supplier deleted Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Supplier deletion Failed');
          if (error instanceof ConflictState) {
            this.toastr.error('This supplier has items associated with it. Please delete or Change items with ' + supplier.supplier);
          }
        }
      );
    }
  }

}
