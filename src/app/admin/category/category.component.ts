import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoryService } from 'src/app/shared/services/category.service';
import { AppError } from 'src/app/shared/errors/app-error';
import { UnprocessableEntity } from 'src/app/shared/errors/unprocessable-entity';
import { ToastrService } from 'ngx-toastr';
import { ConflictState } from 'src/app/shared/errors/conflict-state';
declare var $;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  public categories: any = [];
  @ViewChild('categoryTable') Table;
  @ViewChild('f') categoryForm: NgForm;
  public dataTableCategory: any;
  result: any;
  currentCategory: number;
  buttonvalue: string;
  category = {
    name: ' '
  };

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.buttonvalue = 'Add';
    this.load();
  }


  load() {
    if ($.fn.DataTable.isDataTable(this.Table.nativeElement)) {
      $(this.Table.nativeElement).dataTable().fnDestroy();
    }
    this.categoryService.getAll().subscribe(
      genericsData => {
        this.categories = genericsData;
        this.dataTableCategory = $(this.Table.nativeElement);
        setTimeout(() => {
          this.dataTableCategory.DataTable();
        }, 1);
      }, (err) => {
      }, () => {
      }
    );
  }

  onSubmit() {
    this.category.name = this.categoryForm.value.categoryName;
    this.saveCategoryToServer(this.category);
  }

  saveCategoryToServer(category) {
    if (this.buttonvalue === 'Add') {
      this.categoryService.create(this.category)
        .subscribe(
          (result) => {
            this.resetCategoryForm();
            this.load();
            this.toastr.success('Category created Successfully');
          },
          (error: AppError) => {
            this.toastr.error('Category creation Failed');
          }
        );
    } else {
      this.categoryService.update(this.category, this.currentCategory).subscribe(
        (result) => {
          this.resetCategoryForm();
          this.load();
          this.toastr.success('Category updated Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Category update Failed');
        }
      );
    }
  }

  resetCategoryForm() {
    this.buttonvalue = 'Add';
    this.categoryForm.reset();
  }


  updateCategory(id) {
    this.buttonvalue = 'Edit';
    this.categoryService.getById(id).subscribe((result: any) => {
      this.currentCategory = result.id;
      this.categoryForm.setValue({
        categoryName: result.name
      });
    });
  }


  deleteCategory(category) {
    if (confirm('Are you sure to delete ' + category.name)) {
      this.categoryService.delete(category.id).subscribe(
        (result: any) => {
          this.load();
          this.toastr.success('Category deleted Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Category deletion Failed');
          if(error instanceof ConflictState){
            this.toastr.error('This category has items associated with it. Please delete or Change items with ' + category.name);
          }
        }
      );
    }
  }
}
