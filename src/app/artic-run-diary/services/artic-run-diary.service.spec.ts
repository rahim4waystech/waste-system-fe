import { TestBed } from '@angular/core/testing';

import { ArticRunDiaryService } from './artic-run-diary.service';

describe('ArticRunDiaryService', () => {
  let service: ArticRunDiaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticRunDiaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
