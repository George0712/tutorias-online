import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardtutorComponent } from './cardtutor.component';

describe('CardtutorComponent', () => {
  let component: CardtutorComponent;
  let fixture: ComponentFixture<CardtutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardtutorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardtutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
