import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketMessagesComponent } from './socket-messages.component';

describe('SocketMessagesComponent', () => {
  let component: SocketMessagesComponent;
  let fixture: ComponentFixture<SocketMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocketMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocketMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
