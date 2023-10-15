import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorRoadAccidentComponent } from './motor-road-accident.component';

describe('MotorRoadAccidentComponent', () => {
  let component: MotorRoadAccidentComponent;
  let fixture: ComponentFixture<MotorRoadAccidentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotorRoadAccidentComponent]
    });
    fixture = TestBed.createComponent(MotorRoadAccidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
