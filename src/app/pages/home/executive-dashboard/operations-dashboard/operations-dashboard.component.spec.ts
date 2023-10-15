import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsDashboardComponent } from './operations-dashboard.component';

describe('OperationsDashboardComponent', () => {
  let component: OperationsDashboardComponent;
  let fixture: ComponentFixture<OperationsDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperationsDashboardComponent]
    });
    fixture = TestBed.createComponent(OperationsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
