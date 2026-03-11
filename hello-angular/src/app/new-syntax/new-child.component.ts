import { Component, Input, OnInit } from '@angular/core';
import { NewChildService } from './new-child.service';

@Component({
  selector: 'app-new-child',
  standalone: false,
  template: `<div>Child received state: {{ stateValue }} (Service data: {{ serviceData }})</div>`
})
export class NewChildComponent implements OnInit {
  @Input() stateValue: any;
  serviceData = '';

  constructor(private childService: NewChildService) {}

  ngOnInit() {
    this.serviceData = this.childService.getData();
  }
}
