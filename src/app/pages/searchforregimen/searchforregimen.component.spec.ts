import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchforregimenComponent } from './searchforregimen.component';

describe('SearchforregimenComponent', () => {
  let component: SearchforregimenComponent;
  let fixture: ComponentFixture<SearchforregimenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchforregimenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchforregimenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
