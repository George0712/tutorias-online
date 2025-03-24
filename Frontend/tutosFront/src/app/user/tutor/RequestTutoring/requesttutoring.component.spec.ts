import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesttutoringComponent } from './requesttutoring.component';

describe('RequesttutoringComponent', () => {
  let component: RequesttutoringComponent;
  let fixture: ComponentFixture<RequesttutoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequesttutoringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequesttutoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
