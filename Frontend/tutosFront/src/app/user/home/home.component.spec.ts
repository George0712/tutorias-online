import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component1Component } from './home.component';

describe('Component1Component', () => {
  let component: Component1Component;
  let fixture: ComponentFixture<Component1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Component1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Component1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
