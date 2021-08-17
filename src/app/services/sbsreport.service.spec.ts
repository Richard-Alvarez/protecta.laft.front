import { TestBed } from '@angular/core/testing';

import { SbsreportService } from './sbsreport.service';

describe('SbsreportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SbsreportService = TestBed.get(SbsreportService);
    expect(service).toBeTruthy();
  });
});
