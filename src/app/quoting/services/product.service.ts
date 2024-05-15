import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/app/order/models/product.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


 getAllActiveProducts(): Observable<Product[]> {
  return this.httpClient.get(this._endpoint + 'product?filter=active||eq||1').pipe(map((data) => {
    return <Product[]>data;
  }))
 }
 /**
  * Get a prodict from the backend by id
  *
  * @param id number id of product to get
  *
  * @returns Observable<Product>
  */
 getProductById(id: number): Observable<Product> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('ProductService: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'product/' + id).pipe(map((value: any) => {
     return <Product>value;
  }));
 }


 /**
  * creates a product in the backend based on product object.
  * @param Product product object.
  *
  * @returns Observable<Product>
  */
 createProduct(product: Product): Observable<Product> {


   if(!product) {
     throw new Error('product service: you must supply a product object for saving');
   }

   delete product.createdAt;
   delete product.updatedAt;

   if(product.id > 0) {
     throw new Error('product service: Cannot create a existing object');
   }

   delete product.id;
   return this.httpClient.post(this._endpoint + 'product',
   JSON.stringify(product),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <Product>data;
   }));
 }


 /**
  * updates a product in the backend based on product object.
  * @param product product object.
  *
  * @returns Observable<Product>
  */
 updateProduct(product: Product): Observable<Product> {


   if(!product) {
     throw new Error('product service: you must supply a product object for saving');
   }

   delete product.createdAt;
   delete product.updatedAt;


   if(!product.id || product.id === -1) {
     throw new Error('product service: Cannot update an record without id');
   }

   return this.httpClient.put(this._endpoint + 'product/' + product.id,
   JSON.stringify(product),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <Product>data;
   }));
 }
}
