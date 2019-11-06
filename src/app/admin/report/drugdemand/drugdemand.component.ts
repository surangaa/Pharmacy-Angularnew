import { Component, OnInit, ViewChild } from '@angular/core';
import { DrugdemandService } from 'src/app/shared/services/drugdemand.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { NgForm } from '@angular/forms';
declare var $;

@Component({
  selector: 'app-drugdemand',
  templateUrl: './drugdemand.component.html',
  styleUrls: ['./drugdemand.component.css']
})
export class DrugdemandComponent implements OnInit {
  @ViewChild('demandTable') Table;
  @ViewChild('f') drugdemandForm: NgForm;
  demands: any = [];
  public dataTableItem: any;
  custom: any;

constructor(private drugsdemandService: DrugdemandService
  ) { }
  drugdemand = {
    startdate: '',
    enddate: ''
  };
ngOnInit() {
this.initialData();
}

initialData() {
  this.drugsdemandService.getAll()
  .subscribe(
    drugdemandData => {
      this.loadreport(drugdemandData);
    }
  );
}

  onSubmit(form: NgForm) {
    console.log('submitted');
    const value = form.value;
    this.drugsdemandService.create(value)
      .subscribe(
        (drugdemandData) => {
          console.log(drugdemandData);
          this.loadreport(drugdemandData);
        }
      );
  }

  resetSalesForm() {
    this.drugdemandForm.reset();
  }

  loadreport(drugdemandData) {
this.demands = drugdemandData;
  }
  public genaratePDF() {
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

      pdf.save('drugdemandreport.pdf'); // Generated PDF
    });
  }
}
