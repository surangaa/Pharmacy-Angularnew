import { Component, OnInit, ViewChild } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { SalesService } from 'src/app/shared/services/sales.service';
import { NgForm } from '@angular/forms';
declare var $;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-Sales',
  templateUrl: './Sales.component.html',
  styleUrls: ['./Sales.component.css']
})
export class SalesComponent implements OnInit {
  @ViewChild('salesTable') Table;
  sales: any = [];
  public dataTableItem: any;
  custom: any;

  constructor(private salesService: SalesService) { }
  @ViewChild('f') salesForm: NgForm;
  sale = {
    startdate: '',
    enddate: ''
  };
  // public chartReady = false;
  // public chartOptions = {
  //   title: {
  //     display: true,
  //     text: 'Total sales and Total discounts'
  //   }
  // };

  // public chartLabels = [];
  // public chartType = 'line';
  // public chartLegend = true;
  // public chartData = [];
  // public chartDataSales = {
  //   data: [],
  //   label: 'total sales'
  // };
  // public chartDataDiscounts = {
  //   data: [],
  //   label: 'total discounts'
  // };


  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.salesService.getAll()
      .subscribe(
        (salesData) => {
          this.loadreport(salesData);
          // this.createSalesChart();
        }
      )
  }


  // createSalesChart() {
  //   this.sales.forEach(sale => {
  //     this.chartLabels.push(sale.db_date);
  //     this.chartDataSales.data.push(sale.daily_total_amount);
  //     this.chartDataDiscounts.data.push(sale.daily_discounts_amount);
  //   });

  //   this.chartData.push(
  //     this.chartDataSales,
  //     this.chartDataDiscounts
  //   )
  //   this.chartReady = true;
  // }


  onSubmit(form: NgForm) {
    console.log('submitted');
    const value = form.value;
    this.salesService.create(value)
      .subscribe(
        (salesData) => {
          console.log(salesData);
          this.loadreport(salesData);
        }
      )
  }

  resetSalesForm() {
    this.salesForm.reset();
  }

  loadreport(salesData) {
     this.sales = salesData;
  }


  public genaratePDF() {
    //  const printDoc = new jspdf();

    // printDoc.fromHTML($('#contentToConvert').get(0), 10, 10, {
    //   'width': 700,
    //   'height' : 500
    // });

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

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.save('sales.pdf'); // Generated PDF
      //   printDoc.autoPrint();
      // printDoc.output('dataurlnewwindow');

    });
  }
}
