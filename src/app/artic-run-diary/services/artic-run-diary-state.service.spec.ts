import { TestBed } from '@angular/core/testing';

import { ArticRunDiaryStateService } from './artic-run-diary-state.service';

describe('ArticRunDiaryStateService', () => {
  let service: ArticRunDiaryStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticRunDiaryStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
