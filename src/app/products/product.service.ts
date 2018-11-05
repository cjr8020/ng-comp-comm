import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {of} from 'rxjs/observable/of';

import {catchError, tap} from 'rxjs/operators';

import {IProduct} from './product';

@Injectable()
export class ProductService {
  private productsUrl = 'api/products';
  private products: IProduct[];

  /* currently selected product */
  currentProduct: IProduct | null;

  constructor(private http: HttpClient) {
  }

  getProducts(): Observable<IProduct[]> {
    // check if the products property is set
    if (this.products) {
      console.log('ProductService: returning cached product data');
      return of(this.products);
    }
    // otherwise
    console.log('ProductService: fetching product data');
    return this.http.get<IProduct[]>(this.productsUrl)
      .pipe(
        tap(data => {
          console.log(JSON.stringify(data));
          this.products = data;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * id of '0' indicates a new product.
   * @param id product id
   */
  getProduct(id: number): Observable<IProduct> {
    if (id === 0) {
      return of(this.initializeProduct());
    }
    // if product data is cached, get it from the cache
    if (this.products) {
      const foundItem = this.products.find(
        item => item.id === id
      );
      if (foundItem) {
        return of(foundItem);
      }
    }
    // if product data is NOT cached, retrieve from b/e
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<IProduct>(url)
      .pipe(
        tap(data => console.log('Data: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  saveProduct(product: IProduct): Observable<IProduct> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    if (product.id === 0) {
      return this.createProduct(product, headers);
    }
    return this.updateProduct(product, headers);
  }

  /**
   * Deletes product item.
   * Also removes cached item from the cache when HTTP DELETE succeeds
   * on the backend.
   * @param id
   */
  deleteProduct(id: number): Observable<IProduct> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const url = `${this.productsUrl}/${id}`;
    // delete item on the backend
    return this.http.delete<IProduct>(url, {headers: headers})
      .pipe(
        tap(data => {
          console.log('deleteProduct: ' + id);
          // when delete success, remove item from cache
          const foundIndex = this.products.findIndex(item => item.id === id);
          if (foundIndex > -1) {
            this.products.splice(foundIndex, 1);
            // set current product selection to null after it was delete
            this.currentProduct = null;
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Creates a new product item.
   * @param product
   * @param headers
   */
  private createProduct(product: IProduct, headers: HttpHeaders): Observable<IProduct> {
    product.id = null; // this b/c an in-mem backend is used
    return this.http.post<IProduct>(this.productsUrl, product, {headers: headers})
      .pipe(
        tap(data => {
          console.log('createProduct: ' + JSON.stringify(data));
          this.products.push(data);
          // set currently selected product to the inserted item
          this.currentProduct = data;
        }),
        catchError(this.handleError)
      );
  }

  private updateProduct(product: IProduct, headers: HttpHeaders): Observable<IProduct> {
    const url = `${this.productsUrl}/${product.id}`;
    return this.http.put<IProduct>(url, product, {headers: headers})
      .pipe(
        tap(data => console.log('updateProduct: ' + product.id)),
        catchError(this.handleError)
      );
  }

  private initializeProduct(): IProduct {
    // Return an initialized object
    return {
      'id': 0,
      productName: '',
      productCode: '',
      category: '',
      tags: [],
      releaseDate: '',
      price: 0,
      description: '',
      starRating: 0,
      imageUrl: ''
    };
  }

  private handleError(err: HttpErrorResponse): ErrorObservable {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}, body was: ${err.error}`;
    }
    console.error(err);
    return new ErrorObservable(errorMessage);
  }

}
