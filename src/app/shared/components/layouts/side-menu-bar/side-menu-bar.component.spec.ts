import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuBarComponent } from './side-menu-bar.component';

describe('SideMenuBarComponent', () => {
  let component: SideMenuBarComponent;
  let fixture: ComponentFixture<SideMenuBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideMenuBarComponent]
    });
    fixture = TestBed.createComponent(SideMenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
