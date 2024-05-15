import { Component, OnInit } from '@angular/core';
import { Quote } from 'src/app/order/models/quote.model';
import { ActivatedRoute } from '@angular/router';
import { QuoteValidatorService } from '../../validators/quote-validator.service';
import { QuoteService } from '../../services/quote.service';
import { take, catchError } from 'rxjs/operators';
import { Account } from 'src/app/order/models/account.model';
import { OrderService } from 'src/app/order/services/order.service';
import { QuoteLine } from 'src/app/order/models/quote-line-model';
import { environment } from 'src/environments/environment';
import { CorrespondenceService } from 'src/app/correspondence/services/correspondence.service';
import { Correspondence } from 'src/app/correspondence/models/correspondence.model';
import * as moment from 'moment';
import { EMLINK } from 'constants';

@Component({
  selector: 'app-quote-edit',
  templateUrl: './quote-edit.component.html',
  styleUrls: ['./quote-edit.component.scss']
})
export class QuoteEditComponent implements OnInit {


  quote: Quote = new Quote();

  account: Account = new Account();
  site: Account = new Account();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  quoteLines: any = {quoteLines: []};

constructor(private route: ActivatedRoute,
    private orderService: OrderService,
    private correspondenceService: CorrespondenceService,
    private quoteValidatorService: QuoteValidatorService,
    private quoteService: QuoteService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadQuote(+params['id']);
    })
  }

  loadQuote(id: number): void {
    this.quoteService.getQuoteById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((quote: Quote) => {
      this.quote = quote;
    //  this.loadOrderLines();
    
      if(this.quote.accountId !== -1) {
        this.loadSite(this.quote.accountId);
      } else {
        this.quote.account = new Account();
      }

      this.loadQuoteLines(this.quote.id);
    })
  }

  loadAccount(accountId: number) {
    this.orderService.getAccountById(accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load account');
      return e;
    }))
    .subscribe((account: Account) => {
      this.account = account;
    });
  }

  loadSite(accountId: number) {
    this.orderService.getAccountById(accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load site');
      return e;
    }))
    .subscribe((account: Account) => {
      this.site = account;
      this.loadAccount(this.site.parentId);

      // Quote is tied to site, which is child of account !!!!
      this.quote.accountId = this.site.id;
      this.quote.account.id = this.site.id;
    });
  }

  loadQuoteLines(quoteId: number) {
    this.quoteService.getQuoteLinesByQuoteId(quoteId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('quote lines could not be loaded');
      return e;
    }))
    .subscribe((lines: QuoteLine[]) => {
      this.quoteLines.quoteLines = lines;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.quoteValidatorService.isValid(this.quote)) {
      // try to save it
      this.quoteService.updateQuote(this.quote)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        this.quoteLines.quoteLines.forEach(quoteLine => {
          quoteLine.quote = this.quote;
          quoteLine.quoteId = this.quote.id;
        });
        this.bulkSaveQuoteLines(this.quoteLines.quoteLines);
      })
    } else {
      this.isError = true;
    }
  }

  bulkSaveQuoteLines(quoteLines: QuoteLine[]) {
    if(!quoteLines) {
      this.isServerError = true;
    }

    this.quoteService.createBulkQuoteLines(quoteLines)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data) => {
      this.isSuccess = true;
    })
  }

  createPDFFile() {

    const correspondence = new Correspondence();
    correspondence.entity = 'account';
    correspondence.entityId = this.quote.accountId;
    correspondence.date = moment().format('YYYY-MM-DD');
    correspondence.subject = 'Quote has been exported for customer';
    correspondence.description = 'Quote has been exported for customer: ID: ' + this.quote.id + ' ' + this.quote.name;
    correspondence.correspondenceTypeId = 4;
    correspondence.correspondenceType = {id: 4} as any;
    
    this.correspondenceService.createCorrespondence(correspondence)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not log record of export');
      return e;
    }))
    .subscribe(() => {});

    this.quoteService.getQuotePdf(this.quote.id, environment.invoicing)
    .pipe(take(1))
    .pipe(catchError((e)=> {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not generate invoice please try again later.');
      return e;
    }))
    .subscribe((data:any) => {
      window.open(environment.publicUrl + data.fileName, '_blank');
      // refresh the page so grid is up to date
      window.location.reload();
    })
  }

  emailPDF() {


    this.quoteService.getPdfContents(this.quote.id, environment.invoicing)
    .pipe(take(1))
    .pipe(catchError((e) => {
      return e;
    }))
    .subscribe((data: any) => {

    const eml = `
    To: ${this.account.email}  <${this.account.email}>

    Subject: Requested Quote
    
    X-Unsent: 1
    
    Content-Type: multipart/mixed; boundary=--boundary_text_string
    
     
    
    ----boundary_text_string
    
    Content-Type: text/html; charset=UTF-8
    
     
    
    <html>
    
    <body>
    
    <p>Hi,</p>
    <p>Please find attached your requested quote.</p>
    <br />
    <br />
    Regards,<br/>
    Name
    
    </body>
    
    </html>
    
     
    
    ----boundary_text_string
    
    Content-Type: application/pdf; name=Quote-${this.quote.quoteNumber}.pdf
    
    Content-Transfer-Encoding: base64
    
    Content-Disposition: attachment
    
     
    ${data.data}  
    
    ----boundary_text_string--
    `;





        const link: any = document.createElement('a')

        link.href = this.makeFile(eml);
        link.setAttribute('download', 'quote.eml');

        link.click();
    });

  }



  makeFile (text) {

      let textFile = null;
      const data = new Blob([text], {type: 'text/plain'});

      if (textFile !== null) {
          window.URL.revokeObjectURL(textFile);
      }
      textFile = window.URL.createObjectURL(data);
      return textFile;

  };

  



}
