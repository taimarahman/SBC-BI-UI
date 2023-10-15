import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsRegistryComponent } from './reports-registry.component';

describe('ReportsRegistryComponent', () => {
  let component: ReportsRegistryComponent;
  let fixture: ComponentFixture<ReportsRegistryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsRegistryComponent]
    });
    fixture = TestBed.createComponent(ReportsRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
