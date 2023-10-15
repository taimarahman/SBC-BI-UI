import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMenusComponent } from './sub-menus.component';

describe('SubMenusComponent', () => {
  let component: SubMenusComponent;
  let fixture: ComponentFixture<SubMenusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubMenusComponent]
    });
    fixture = TestBed.createComponent(SubMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
