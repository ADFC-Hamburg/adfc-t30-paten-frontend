import { TestBed } from '@angular/core/testing';

import { T30PatenService } from './t30-paten.service';

describe('T30PatenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: T30PatenService = TestBed.get(T30PatenService);
    expect(service).toBeTruthy();
  });
});
