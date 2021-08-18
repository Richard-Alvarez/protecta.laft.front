import { TestBed } from '@angular/core/testing';

import { LaftService } from './laft.service';

describe('LaftService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LaftService = TestBed.get(LaftService);
    expect(service).toBeTruthy();
  });
});
