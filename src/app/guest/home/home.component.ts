import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HomeProductsService } from 'src/app/shared/services/home-products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public products: any = [];
  public customizedProducts: any = [];
  public productBaseURL = 'http://127.0.0.1:8000/images/products/';
  public defaultImage = 'product-default/png';
  public imgURL: any;
  public newImage = null;
  public urlWithParams = '';
  public searchTerm = '';

  public pager = {
    first_page: 0,
    first_page_url: '',
    last_page: 0,
    last_page_url: '',
    next_page: 0,
    next_page_url: '',
    current_page: 0,
    total: 0,
    page_size: 0,
  };

  constructor(
    private homeProductsService: HomeProductsService,
  ) { }

  ngOnInit() {
    this.getPage();
  }

  getPage(page = 1) {
    console.log(this.searchTerm);
    this.customizedProducts = [];
    const searchReplaced = this.searchTerm.replace(/[^a-zA-Z ]/g, '');
    this.urlWithParams = '?page=' + page + '&search=' + searchReplaced;
    this.homeProductsService.getPaginateData(this.urlWithParams).subscribe(
      (productsData: any) => {
        this.products = productsData.data;
        this.generatePagination(productsData);
        this.products.forEach((product, index) => {
          this.imgURL = this.productBaseURL + product.src;
          if (index % 4 === 0) {
            const row = [];
            row.push(product);
            this.customizedProducts.push(row);
          } else {
            this.customizedProducts[this.customizedProducts.length - 1].push(product);
          }
        });
      }
    );
    this.scrollToTop();
  }

  generatePagination(data) {
    this.pager.current_page = +data.current_page;
    this.pager.first_page = 1;
    this.pager.last_page = +data.last_page;
    this.pager.total = +data.total;
    this.pager.page_size = +data.per_page;
  }

  scrollToTop(){
    window.scrollTo(0, 0);
  }

}
