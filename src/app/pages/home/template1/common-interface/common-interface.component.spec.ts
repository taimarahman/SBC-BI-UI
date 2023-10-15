import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonInterfaceComponent } from './common-interface.component';

describe('CommonInterfaceComponent', () => {
  let component: CommonInterfaceComponent;
  let fixture: ComponentFixture<CommonInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonInterfaceComponent]
    });
    fixture = TestBed.createComponent(CommonInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
