import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C2InfoPolicyComponent } from './c2-info-policy.component';

describe('C2InfoPolicyComponent', () => {
  let component: C2InfoPolicyComponent;
  let fixture: ComponentFixture<C2InfoPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C2InfoPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C2InfoPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
