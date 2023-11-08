import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdhocReportComponent } from './adhoc-report.component';

describe('AdhocReportComponent', () => {
  let component: AdhocReportComponent;
  let fixture: ComponentFixture<AdhocReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdhocReportComponent]
    });
    fixture = TestBed.createComponent(AdhocReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
