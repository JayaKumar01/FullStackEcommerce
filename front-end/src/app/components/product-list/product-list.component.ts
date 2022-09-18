import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products : Product[] = [];
  currCategoryId: number = 1;
  prevCategoryId: number = 1;
  hasSearch: boolean = false; 

  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
       this.listProducts();
    });
  } 

  listProducts() {
    this.hasSearch = this.route.snapshot.paramMap.has('keyword'); 

    if(this.hasSearch) {
      this.getSearchProducts();
    }
    else {
      this.getListProducts();
    }
  }


  getListProducts() { 
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    
    if (hasCategoryId) {
      this.currCategoryId = +this.route.snapshot.paramMap.get('id')!; 
      //console.log(this.categoryId);
    }else {
      this.currCategoryId = 1;
    }  

    if(this.prevCategoryId != this.currCategoryId) {
      this.pageNumber = 1;
    } 

    this.prevCategoryId = this.currCategoryId;

    this.productService.getProductListPagination(this.pageNumber-1, this.pageSize, this.currCategoryId)
    .subscribe(data => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    });

    // this.productService.getProductList(this.currCategoryId).subscribe(data => {
    //   this.products = data;
    // })
    
  } 

  //search
  getSearchProducts(){
    const searchWord: string = this.route.snapshot.paramMap.get('keyword')!; 

    this.productService.searchProducts(searchWord).subscribe(
      data => {
        this.products = data;
        console.log(this.products);
        
      }
    )
  } 
  
  addToCart(product: Product) {
   // console.log(`${product.name}, ${product.unitPrice}`); 
    console.log(product.id);
    const theCartItem = new CartItem(product); 
    this.cartService.addToCart(theCartItem);
  }
}
