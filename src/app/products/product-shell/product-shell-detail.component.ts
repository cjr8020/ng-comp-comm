import {Component, OnInit} from '@angular/core';
import {ProductService} from '../product.service';
import {IProduct} from '../product';

@Component({
  selector: 'pm-product-shell-detail',
  templateUrl: './product-shell-detail.component.html'
})
export class ProductShellDetailComponent implements OnInit {
  pageTitle: string = 'Product Detail';

  product: IProduct | null;

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    // subscribe within ngOnInit to receive value when component initializes.
    this.productService.selectedProductChanges$.subscribe(
      selectedProduct => this.product = selectedProduct
    );
  }

  /**
   * This getter helps bind the template to the component property.
   * Angular change detection mechanism invokes the getter any  time
   * change is detected.
   */
  // get product(): IProduct | null {
  //   return this.productService.currentProduct;
  // }

}
