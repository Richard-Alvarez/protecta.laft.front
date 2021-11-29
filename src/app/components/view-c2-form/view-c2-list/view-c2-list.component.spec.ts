import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewC2ListComponent } from './view-c2-list.component';

describe('ViewC2FormComponent', () => {
  let component: ViewC2ListComponent;
  let fixture: ComponentFixture<ViewC2ListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewC2ListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewC2ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
