import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C2PolicyComponent } from './c2-policy.component';

describe('C2PolicyComponent', () => {
  let component: C2PolicyComponent;
  let fixture: ComponentFixture<C2PolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C2PolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C2PolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
