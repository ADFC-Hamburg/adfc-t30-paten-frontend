import { TestBed } from '@angular/core/testing';

import { ErrorNotifierService } from './error-notifier.service';

describe('ErrorNotifierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErrorNotifierService = TestBed.get(ErrorNotifierService);
    expect(service).toBeTruthy();
  });
});
