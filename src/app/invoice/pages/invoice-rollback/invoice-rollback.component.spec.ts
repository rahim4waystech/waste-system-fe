import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { RouterTestingModule } from '@angular/router/testing';
import { InvoiceRollbackComponent } from './invoice-rollback.component';
import { Invoice } from '../../models/invoice.model';
import { of } from 'rxjs/internal/observable/of';

describe('InvoiceRollbackComponent', () => {
  let component: InvoiceRollbackComponent;
  let fixture: ComponentFixture<InvoiceRollbackComponent>;
  let invoiceServiceStub: any = {
    getInvoiceById: (id) => {
      return of({id: 1});
    },
    rollback: () => {
      return of({});
    }
  }
  beforeEach(() => {
    const activatedRouteStub = () => ({ params: { subscribe: f => f({}) } });
    const routerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InvoiceRollbackComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: InvoiceService, useValue: invoiceServiceStub }
      ]
    });
    fixture = TestBed.createComponent(InvoiceRollbackComponent);
    component = fixture.componentInstance;
  });



  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('should get invoice by id', () => {
    spyOn(invoiceServiceStub, 'getInvoiceById').and.callThrough();
    component.loadInvoice(1);
    expect(invoiceServiceStub.getInvoiceById).toHaveBeenCalled();
  })

  it('makes expected calls', () => {

    component.invoice = {id: 1} as Invoice;
    const invoiceServiceStub: InvoiceService = fixture.debugElement.injector.get(
      InvoiceService
    );

    // make redirect do nothing as we don't need it for the test.
    component['redirect'] = () => {};
  
    spyOn(invoiceServiceStub, 'rollback').and.callThrough();
    component.onCancelClicked();
    expect(invoiceServiceStub.rollback).toHaveBeenCalled();
  });
});
