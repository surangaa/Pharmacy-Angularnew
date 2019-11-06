import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HomeProductsService } from 'src/app/shared/services/home-products.service';

@Component({
  selector: 'app-navbarguest',
  templateUrl: './navbarguest.component.html',
  styleUrls: ['./navbarguest.component.css']
})
export class NavbarguestComponent implements OnInit {
  searchValue: '';
  constructor(private product: HomeProductsService) { }

  ngOnInit() {

  }

  onSubmit() {
    // this.searchValue = null;
    // console.log('submitted');
    // const value = this.searchValue;
    // this.product.create(value)
    //   .subscribe(
    //     (searchData) => {
    //       console.log(searchData);
    //       this.loadpage(searchData);
    //     }
    //   );
  }

  loadpage(searchData) {
    this.product = searchData;
  }

}
