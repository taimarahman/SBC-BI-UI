import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentSummaryComponent } from './recruitment-summary.component';

describe('RecruitmentSummaryComponent', () => {
  let component: RecruitmentSummaryComponent;
  let fixture: ComponentFixture<RecruitmentSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruitmentSummaryComponent]
    });
    fixture = TestBed.createComponent(RecruitmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
