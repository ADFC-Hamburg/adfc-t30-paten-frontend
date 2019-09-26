import { TestBed } from '@angular/core/testing';

import { ForderungService } from './forderung.service';

describe('ForderungService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForderungService = TestBed.get(ForderungService);
    expect(service).toBeTruthy();
  });
});
