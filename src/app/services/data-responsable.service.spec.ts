import { TestBed } from '@angular/core/testing';

import { DataResponsableService } from './data-responsable.service';

describe('DataResponsableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataResponsableService = TestBed.get(DataResponsableService);
    expect(service).toBeTruthy();
  });
});
