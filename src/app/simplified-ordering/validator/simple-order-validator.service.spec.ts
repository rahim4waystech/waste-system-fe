import { TestBed } from '@angular/core/testing';

import { SimpleOrderValidatorService } from './simple-order-validator.service';

describe('SimpleOrderValidatorService', () => {
  let service: SimpleOrderValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimpleOrderValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
