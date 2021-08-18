import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginacionReutilComponent } from './paginacion-reutil.component';

describe('PaginacionReutilComponent', () => {
  let component: PaginacionReutilComponent;
  let fixture: ComponentFixture<PaginacionReutilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginacionReutilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginacionReutilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
