import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailtutorComponent } from './detailtutor.component';

describe('DetailtutorComponent', () => {
  let component: DetailtutorComponent;
  let fixture: ComponentFixture<DetailtutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailtutorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailtutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
