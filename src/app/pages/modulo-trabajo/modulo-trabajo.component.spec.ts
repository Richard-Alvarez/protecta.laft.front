import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloTrabajoComponent } from './modulo-trabajo.component';

describe('ModuloTrabajoComponent', () => {
  let component: ModuloTrabajoComponent;
  let fixture: ComponentFixture<ModuloTrabajoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuloTrabajoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
