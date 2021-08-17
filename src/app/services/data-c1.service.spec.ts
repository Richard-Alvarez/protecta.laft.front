import { TestBed } from '@angular/core/testing';

import { DataC1Service } from './data-c1.service';

describe('DataC1Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataC1Service = TestBed.get(DataC1Service);
    expect(service).toBeTruthy();
  });
});
