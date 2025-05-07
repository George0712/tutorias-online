import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLanguajeComponent } from './modal-languaje.component';

describe('ModalLanguajeComponent', () => {
  let component: ModalLanguajeComponent;
  let fixture: ComponentFixture<ModalLanguajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalLanguajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLanguajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
