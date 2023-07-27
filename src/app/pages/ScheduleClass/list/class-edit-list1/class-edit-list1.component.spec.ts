import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassEditList1Component } from './class-edit-list1.component';

describe('ClassEditList1Component', () => {
  let component: ClassEditList1Component;
  let fixture: ComponentFixture<ClassEditList1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassEditList1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassEditList1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
