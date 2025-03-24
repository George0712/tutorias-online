import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaditionaldataComponent } from './formaditionaldata.component';

describe('FormaditionaldataComponent', () => {
  let component: FormaditionaldataComponent;
  let fixture: ComponentFixture<FormaditionaldataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormaditionaldataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormaditionaldataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
