import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegativeRecordsComponent } from './negative-records.component';

describe('NegativeRecordsComponent', () => {
  let component: NegativeRecordsComponent;
  let fixture: ComponentFixture<NegativeRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegativeRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegativeRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
