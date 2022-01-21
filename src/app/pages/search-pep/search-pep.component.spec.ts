import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPepComponent } from './search-pep.component';

describe('SearchPepComponent', () => {
  let component: SearchPepComponent;
  let fixture: ComponentFixture<SearchPepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
