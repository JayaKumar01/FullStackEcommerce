import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products'

  constructor(private http: HttpClient)  { } 

  getProductList(categoryId: number): Observable<Product[]> { 
    
     const url = `http://localhost:8080/products/search-category?id=${categoryId}`;

    // const url = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.http.get<ResponseProduct>(url).pipe(
      map(response => response.content)
    );
  } 
  
  getProductCategories(): Observable<ProductCategory[]>{ 
    const url = 'http://localhost:8080/product-category'
    return this.http.get<ProductCategory[]>(url).pipe(
      map(response => response)
    );
  } 

  searchProducts(searchWord: string): Observable<Product[]> {
   
   const url = `http://localhost:8080/search-product?name=${searchWord}`;

    return this.http.get<ResponseProduct>(url).pipe(
      map(response => response.content)
    );
  } 

  getProduct(productId: number): Observable<Product> {
    const url = `http://localhost:8080/products/${productId}`; 
    return this.http.get<Product>(url);
  } 

  getProductListPagination(page: number, 
                          pageSize: number,
                          categoryId: number): Observable<Response> {

    const url = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
                  + `&page=${page}&size=${pageSize}`; 
    return this.http.get<Response>(url);
  }

} 


interface ResponseProduct{
  content : []
}

interface Response {
  _embedded : {
    products: Product[];
  }, 
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
} 


