import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCsvToJsonComponent } from './order-csv-to-json.component';

describe('OrderArticImportSheetComponent', () => {
  let component: OrderCsvToJsonComponent;
  let fixture: ComponentFixture<OrderCsvToJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderCsvToJsonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCsvToJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
