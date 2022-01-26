import { TestBed, async, inject } from '@angular/core/testing';

import { VigilanteGuard } from './vigilante.guard';

describe('VigilanteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VigilanteGuard]
    });
  });

  it('should ...', inject([VigilanteGuard], (guard: VigilanteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
