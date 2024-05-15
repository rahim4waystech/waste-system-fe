import { TestBed } from '@angular/core/testing';

import { ArticSheetService } from './artic-sheet.service';

describe('ArticSheetService', () => {
  let service: ArticSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticSheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
