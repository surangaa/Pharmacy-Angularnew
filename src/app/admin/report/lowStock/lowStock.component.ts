import { Component, OnInit } from '@angular/core';
import { LowstockService } from 'src/app/shared/services/lowstock.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { SupplierService } from 'src/app/shared/services/supplier.service';
declare var $;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-lowStock',
  templateUrl: './lowStock.component.html',
  styleUrls: ['./lowStock.component.css']
})
export class LowStockComponent implements OnInit {
  lowstocks: any = [];
  suppliers: any;

  constructor(private lowstockService: LowstockService, private supplierService: SupplierService) { }

  ngOnInit() {
    this.loadOthers();
  }

  loadOthers() {
    this.supplierService.getAll().subscribe(
      supplierData => {
        this.suppliers = supplierData;
      }
    );

    this.lowstockService.getAll()
      .subscribe(
        lowstockdrugData => {
          console.log(lowstockdrugData);
          this.lowstocks = lowstockdrugData;
        }
      );
  }
  getSupplierName(id) {
    const supplier = this.suppliers.find(supplier => +supplier.id === +id);
    return supplier.supplier;
  }
  
  generatePDF(){
    const print = document.getElementById('contentToConvert');
    html2canvas(print).then(canvas => {
      // Few necessary setting options
      // tslint:disable-next-line:prefer-const
      let imgWidth = 150;
      // let pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      // let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)

      pdf.save('lowstockdrugreport.pdf'); // Generated PDF
    });
  }
}
