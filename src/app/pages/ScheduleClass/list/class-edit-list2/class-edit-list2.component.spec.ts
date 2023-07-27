import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassEditList2Component } from './class-edit-list2.component';

describe('ClassEditList2Component', () => {
  let component: ClassEditList2Component;
  let fixture: ComponentFixture<ClassEditList2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassEditList2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassEditList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
