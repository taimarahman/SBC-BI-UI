import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbDataTableComponent } from './ngb-data-table.component';

describe('NgbDataTableComponent', () => {
  let component: NgbDataTableComponent;
  let fixture: ComponentFixture<NgbDataTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgbDataTableComponent]
    });
    fixture = TestBed.createComponent(NgbDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
