import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTutorComponent } from './profileTutor.component';

describe('ProfileComponent', () => {
  let component: ProfileTutorComponent;
  let fixture: ComponentFixture<ProfileTutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileTutorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
