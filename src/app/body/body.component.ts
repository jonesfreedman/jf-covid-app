import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  public clickedEvent: Event;

  constructor() { }

  ngOnInit() {
  }

  childEventClicked(event: Event) {
    this.clickedEvent = event;
  }

}
