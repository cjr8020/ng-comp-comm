import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import { IProduct } from './product';
import { ProductService } from './product.service';
import {ProductParameterService} from './product-parameter.service';

@Component({
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {
    pageTitle: string = 'Product List';

    imageWidth: number = 50;
    imageMargin: number = 2;
    errorMessage: string;

    filteredProducts: IProduct[];
    products: IProduct[];

    @ViewChild('filterElement') filterElementRef: ElementRef;

    constructor(
      private productService: ProductService,
      private productParameterService: ProductParameterService) {
    }

    ngOnInit(): void {
        this.productService.getProducts().subscribe(
            (products: IProduct[]) => {
                this.products = products;
                this.performFilter(this.listFilter);
            },
            (error: any) => this.errorMessage = <any>error
        );
    }

    ngAfterViewInit(): void {
      this.filterElementRef.nativeElement.focus();
    }

    get showImage(): boolean {
        return this.productParameterService.showImage;
    }

    set showImage(value: boolean) {
        this.productParameterService.showImage = value;
    }



    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    get listFilter(): string {
      return this.productParameterService.filterBy;
    }

    set listFilter(value: string) {
      this.productParameterService.filterBy = value;
      this.performFilter(this.productParameterService.filterBy);
    }






    performFilter(filterBy?: string): void {
        if (filterBy) {
            this.filteredProducts = this.products.filter((product: IProduct) =>
                product.productName.toLocaleLowerCase().indexOf(filterBy.toLocaleLowerCase()) !== -1);
        } else {
            this.filteredProducts = this.products;
        }
    }
}
