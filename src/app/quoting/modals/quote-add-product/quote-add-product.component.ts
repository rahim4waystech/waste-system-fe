import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/order/models/product.model';
import { QuoteLine } from 'src/app/order/models/quote-line-model';
import { QuoteLineValidatorService } from '../../validators/quoteline-validator.service';
import { QuoteStateService } from '../../services/quote-state.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-quote-add-product',
  templateUrl: './quote-add-product.component.html',
  styleUrls: ['./quote-add-product.component.scss']
})
export class QuoteAddProductComponent implements OnInit {

  @Input()
  products: Product[] = [];

  quoteLine: QuoteLine = new QuoteLine();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private quoteLineValidatorService: QuoteLineValidatorService,
    private modalService: ModalService,
    private quoteStateService: QuoteStateService) { }

  ngOnInit(): void {
  }

  onProductChanged($event) {
    this.quoteLine.productId = +$event.target.value;
    this.quoteLine.product.id = this.quoteLine.productId;

    const product = this.products.filter(p => p.id === this.quoteLine.productId)[0];

    if(!product) {
      this.quoteLine.productId = -1;
      this.quoteLine.product.id = -1;
      alert('Product could not be found. Please try again later');
    }

    this.quoteLine.product = product;
    this.quoteLine.newPrice = product.price;
  }

  onSubmit() {
    this.isError = false;
    this.isServerError = false;
    if(!this.quoteLineValidatorService.isValid(this.quoteLine)) {
      this.isError = true;
      return;
    }

    this.quoteStateService.$newQuoteLineAdded.next(JSON.parse(JSON.stringify(this.quoteLine)));
    this.reset();
    this.close();

  }

  close() {
    this.modalService.close('quoteAddProductModal');
  }

  reset() {
    this.quoteLine = new QuoteLine();
    this.isError = false;
  }
}
