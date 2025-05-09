import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormpersonaldataComponent } from './form-personal-data.component';

describe('FormpersonaldataComponent', () => {
  let component: FormpersonaldataComponent;
  let fixture: ComponentFixture<FormpersonaldataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormpersonaldataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormpersonaldataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
