import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/order/models/product.model';
import { ProductValidatorService } from '../../validators/product-validator.service';
import { ProductService } from '../../services/product.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product-new',
  templateUrl: './product-new.component.html',
  styleUrls: ['./product-new.component.scss']
})
export class ProductNewComponent implements OnInit {


  product: Product = new Product();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private productValidator: ProductValidatorService,
    private productService: ProductService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.productValidator.isValid(this.product)) {
      // try to save it
      this.productService.createProduct(this.product)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/quoting/products';
      })
    } else {
      this.isError = true;
    }
  }


}
