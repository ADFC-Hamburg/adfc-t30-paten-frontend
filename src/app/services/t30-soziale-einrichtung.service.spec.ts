import { TestBed } from '@angular/core/testing';

import { T30SozialeEinrichtungService } from './t30-soziale-einrichtung.service';

describe('T30SozialeEinrichtungService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: T30SozialeEinrichtungService = TestBed.get(T30SozialeEinrichtungService);
    expect(service).toBeTruthy();
  });
});
