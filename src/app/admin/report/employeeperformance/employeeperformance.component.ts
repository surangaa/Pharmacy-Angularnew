import { Component, OnInit, ViewChild } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { PerformanceService } from 'src/app/shared/services/performance.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
declare var $;

@Component({
  selector: 'app-employeeperformance',
  templateUrl: './employeeperformance.component.html',
  styleUrls: ['./employeeperformance.component.css']
})
export class EmployeeperformanceComponent implements OnInit {

  @ViewChild('performanceTable') Table;
  @ViewChild('f') performanceForm: NgForm;
  performances: any = [];
  users: any;
  public dataTableItem: any;

  constructor(private performanceService: PerformanceService
    ) { }
  performance = {
    startdate: '',
    enddate: ''
  };

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.performanceService.getAll()
      .subscribe(
        performanceData => {
          this.loadreport(performanceData);
        }
      );
  }

  onSubmit(form: NgForm) {
    console.log('submitted');
    const value = form.value;
    this.performanceService.create(value)
      .subscribe(
        (performanceData) => {
          console.log(performanceData);
          this.loadreport(performanceData);
        }
      );
  }

  resetPerformanceForm() {
    this.performanceForm.reset();
  }

  loadreport(performanceData) {
    this.performances = performanceData;
  }
  public genaratePDF() {
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

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.save('userperformance.pdf'); // Generated PDF
      //   printDoc.autoPrint();
      // printDoc.output('dataurlnewwindow');

    });
  }
}
