import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWarningc2DatabaseComponent } from './view-warningc2-database.component';

describe('ViewWarningc2DatabaseComponent', () => {
  let component: ViewWarningc2DatabaseComponent;
  let fixture: ComponentFixture<ViewWarningc2DatabaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWarningc2DatabaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWarningc2DatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
