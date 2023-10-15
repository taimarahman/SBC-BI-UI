import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleEntryComponent } from './role-entry.component';

describe('RoleEntryComponent', () => {
  let component: RoleEntryComponent;
  let fixture: ComponentFixture<RoleEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleEntryComponent]
    });
    fixture = TestBed.createComponent(RoleEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
