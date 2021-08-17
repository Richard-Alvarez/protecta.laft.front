import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewC2DetailComponent } from './view-c2-detail.component';

describe('ViewC2DetailComponent', () => {
  let component: ViewC2DetailComponent;
  let fixture: ComponentFixture<ViewC2DetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewC2DetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewC2DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
