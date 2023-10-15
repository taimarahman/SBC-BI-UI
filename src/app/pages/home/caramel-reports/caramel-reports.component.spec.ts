import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaramelReportsComponent } from './caramel-reports.component';

describe('CaramelReportsComponent', () => {
  let component: CaramelReportsComponent;
  let fixture: ComponentFixture<CaramelReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaramelReportsComponent]
    });
    fixture = TestBed.createComponent(CaramelReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
