import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpTutorComponent } from './sign-up-tutor.component';

describe('SignUpTutorComponent', () => {
  let component: SignUpTutorComponent;
  let fixture: ComponentFixture<SignUpTutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpTutorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
