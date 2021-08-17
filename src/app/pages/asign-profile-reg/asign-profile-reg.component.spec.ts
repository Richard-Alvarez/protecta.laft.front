import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignProfileRegComponent } from './asign-profile-reg.component';

describe('AsignProfileRegComponent', () => {
  let component: AsignProfileRegComponent;
  let fixture: ComponentFixture<AsignProfileRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignProfileRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignProfileRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
