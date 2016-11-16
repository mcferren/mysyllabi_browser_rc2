/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SSSCalendarService } from './../sss-calendar.service';

describe('Service: SSSCalendar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SSSCalendarService]
    });
  });

  it('should ...', inject([SSSCalendarService], (service: SSSCalendarService) => {
    expect(service).toBeTruthy();
  }));
});
