import { TestBed } from '@angular/core/testing';

import { RelationInstitutionService } from './relation-institution.service';

describe('RelationInstitutionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RelationInstitutionService = TestBed.get(RelationInstitutionService);
    expect(service).toBeTruthy();
  });
});
