import { TestBed } from '@angular/core/testing';

import { DemandedStreetSectionService } from './demanded-street-section.service';

describe('DemandedStreetSectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DemandedStreetSectionService = TestBed.get(DemandedStreetSectionService);
    expect(service).toBeTruthy();
  });
});