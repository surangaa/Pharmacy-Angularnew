import { Component, OnInit, ViewChild } from '@angular/core';
import { GenericService } from 'src/app/shared/services/generic.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppError } from 'src/app/shared/errors/app-error';
import { ConflictState } from 'src/app/shared/errors/conflict-state';
declare var $;
@Component({
  selector: 'app-generic',
  templateUrl: './generic.component.html',
  styleUrls: ['./generic.component.css']
})
export class GenericComponent implements OnInit {
  public generics: any = [];
  @ViewChild('genericsTable') Table;
  @ViewChild('f') genericForm: NgForm;
  public dataTableGen: any;
  result: any;
  currentGeneric: number;
  buttonValue: string;
  generic = {
    name: ''
  };

  constructor(
    private genericService: GenericService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.buttonValue = 'Add';
    this.loadGenerics();
  }

  loadGenerics() {
    if ($.fn.DataTable.isDataTable(this.Table.nativeElement) ) {
      $(this.Table.nativeElement).dataTable().fnDestroy();
    }
    this.genericService.getAll().subscribe(
      genericsData => {
        this.generics = genericsData;
        this.dataTableGen = $(this.Table.nativeElement);
        setTimeout(() => {
          this.dataTableGen.DataTable();
        }, 1);
      }, (err) => {
      }, () => {
      }
    );
  }

  onSubmit() {
    this.generic.name = this.genericForm.value.genericName;
    this.saveGenericToServer(this.generic);
  }

  saveGenericToServer(generic) {
    if (this.buttonValue === 'Add') {
      this.genericService.create(generic).subscribe(
        (result) => {
          this.resetGenericForm();
          this.loadGenerics();
          this.toastr.success('Generic created Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Generic creation Failed');
        }
      );
    } else {
      this.genericService.update(generic, this.currentGeneric).subscribe(
        (result) => {
          this.resetGenericForm();
          this.loadGenerics();
          this.toastr.success('Generic updated Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Generic update Failed');
        }
      );
    }
  }

  updateGeneric(id) {
    this.buttonValue = 'Edit';
    this.genericService.getById(id).subscribe((result: any) => {
      this.currentGeneric = result.id;
      this.genericForm.setValue({
        genericName: result.name
      });
    });
  }

  resetGenericForm() {
    this.buttonValue = 'Add';
    this.genericForm.reset();
  }

  deleteGeneric(generic) {
    if (confirm('Are you sure to delete ' + generic.name)) {
      this.genericService.delete(generic.id).subscribe(
        (result: any) => {
          this.loadGenerics();
          this.toastr.success('generic deleted Successfully');
        },
        (error: AppError) => {
          this.toastr.error('generic deletion Failed');
          if (error instanceof ConflictState) {
            this.toastr.error('This generic has items associated with it. Please delete or Change items with ' + generic.name);
          }
        }
      );
    }
  }

}
