import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveDashboardComponent } from './interactive-dashboard.component';

describe('InteractiveDashboardComponent', () => {
  let component: InteractiveDashboardComponent;
  let fixture: ComponentFixture<InteractiveDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InteractiveDashboardComponent]
    });
    fixture = TestBed.createComponent(InteractiveDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
