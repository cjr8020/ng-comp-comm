import {Component, OnDestroy, OnInit} from '@angular/core';

import { IProduct } from '../product';
import { ProductService } from '../product.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'pm-product-shell-list',
  templateUrl: './product-shell-list.component.html'
})
export class ProductShellListComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Products';
  errorMessage: string;
  products: IProduct[];
  selectedProduct: IProduct | null;

  private selectedProductSubscription: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {

    this.selectedProductSubscription = this.productService.selectedProductChanges$.subscribe(selectedProduct => {
        this.selectedProduct = selectedProduct;
    });

    this.productService.getProducts().subscribe(
      (products: IProduct[]) => {
        this.products = products;
      },
      (error: any) => this.errorMessage = <any>error
    );
  }

  onSelected(product: IProduct) {
    this.productService.changeSelectedProduct(product);
  }

  ngOnDestroy(): void {
    this.selectedProductSubscription.unsubscribe();
  }

}
