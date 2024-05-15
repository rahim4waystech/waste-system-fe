import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/order/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { ProductValidatorService } from '../../validators/product-validator.service';
import { ProductService } from '../../services/product.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  product: Product = new Product();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private productValidator: ProductValidatorService,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadProduct(+params['id']);
    })
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((product: Product) => {
      this.product = product;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.productValidator.isValid(this.product)) {
      // try to save it
      this.productService.updateProduct(this.product)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        this.isSuccess = true;
      })
    } else {
      this.isError = true;
    }
  }


}
