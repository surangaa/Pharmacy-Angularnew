import { Component, OnInit } from '@angular/core';
import { ExpirydrugsService } from 'src/app/shared/services/expirydrugs.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
declare var $;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-expiringDrug',
  templateUrl: './expiringDrug.component.html',
  styleUrls: ['./expiringDrug.component.css']
})
export class ExpiringDrugComponent implements OnInit {
  expires: any = [];
  suppliers: any;

  constructor(private expirydrugservice: ExpirydrugsService,
    private supplierService: SupplierService) { }

  ngOnInit() {
    this.loadOthers();
  }
  loadOthers() {
    this.supplierService.getAll().subscribe(
      supplierData => {
        console.log(supplierData);
        this.suppliers = supplierData;
      }
    );

    this.expirydrugservice.getAll()
      .subscribe(
        expiringdrugData => {
          console.log(expiringdrugData);
          this.expires = expiringdrugData;
        }
      );

  }

  getSupplierName(id) {
    const supplier = this.suppliers.find(supplier => +supplier.id === +id);
    return supplier.supplier;
  }

  generatePDF() {
    const printDoc = new jspdf();
    // printDoc.text(50, 10, 'Weerasiri Pharmacy - Demand for the drugs Report');
    // printDoc.text(10, 20, '33/A,Kirillawala,Kadawatha T.P:0112345672');
    // const today = new Date().toISOString().slice(0, 10);
    // printDoc.text(10, 30, today);
    // printDoc.fromHTML($('#demandTable').get(0), 10, 10, {
    //   'width': 180
    // });
    // printDoc.autoPrint();
    // printDoc.output('dataurlnewwindow');
    // const doc = new jspdf();
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

      pdf.save('expiringdrugreport.pdf'); // Generated PDF
    });
  }
}
