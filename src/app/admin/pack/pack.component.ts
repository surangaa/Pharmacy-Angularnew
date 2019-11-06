import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PackService } from 'src/app/shared/services/pack.service';
import { ToastrService } from 'ngx-toastr';
import { AppError } from 'src/app/shared/errors/app-error';
import { ConflictState } from 'src/app/shared/errors/conflict-state';
declare var $;

@Component({
  selector: 'app-pack',
  templateUrl: './pack.component.html',
  styleUrls: ['./pack.component.css']
})
export class PackComponent implements OnInit {
  public packs: any = [];
  @ViewChild('packsTable') Table;
  @ViewChild('f') packForm: NgForm;
  public dataTablePack: any;
  result: any;
  currentPack: number;
  buttonValue: string;
  pack = {
    name: ''
  };
  constructor(
    private packService: PackService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.buttonValue = 'Add';
    this.loadPacks();
  }

  loadPacks() {
    if ($.fn.DataTable.isDataTable(this.Table.nativeElement)) {
      $(this.Table.nativeElement).dataTable().fnDestroy();
    }
    this.packService.getAll().subscribe(
      packsData => {
        this.packs = packsData;
        this.dataTablePack = $(this.Table.nativeElement);
        setTimeout(() => {
          this.dataTablePack.DataTable();
        }, 1);
      }, (err) => {
      }, () => {
      }
    );
  }
  onSubmit() {
    this.pack.name = this.packForm.value.packSize;
    this.savePackToServer(this.pack);
  }

  savePackToServer(pack) {
    if (this.buttonValue === 'Add') {
      this.packService.create(pack).subscribe(
        (result) => {
          this.resetPackForm();
          this.loadPacks();
          this.toastr.success('Pack created Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Pack creation Failed');
        }
      );
    } else {
      this.packService.update(pack, this.currentPack).subscribe(
        (result) => {
          this.resetPackForm();
          this.loadPacks();
          this.toastr.success('Pack updated Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Pack update Failed');
        }
      );
    }
  }

  updatePack(id) {
    this.buttonValue = 'Edit';
    this.packService.getById(id).subscribe((result: any) => {
      this.currentPack = result.id;
      this.packForm.setValue({
        packSize: result.name
      });
    });
  }

  resetPackForm() {
    this.buttonValue = 'Add';
    this.packForm.reset();
  }

  deletePack(pack) {
    if (confirm('Are you sure to delete ' + pack.name + '. there are items with pack type ' + pack.name)) {
      this.packService.delete(pack.id).subscribe(
        (result: any) => {
          this.loadPacks();
          this.toastr.success('Pack deleted Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Pack deletion Failed');
          if (error instanceof ConflictState) {
            this.toastr.error('This pack has items associated with it. Please delete or Change items with ' + pack.name);
          }
        }

      );
    }
  }

}
