import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeConfigComponent } from './edge-config.component';

describe('EdgeConfigComponent', () => {
  let component: EdgeConfigComponent;
  let fixture: ComponentFixture<EdgeConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdgeConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdgeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
