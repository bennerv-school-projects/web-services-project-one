import { Component, OnInit } from '@angular/core';
import { Details } from './details';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  details: Details = { };
  validForm = true;
  invalidHints : String[] = [];

  constructor() { }

  ngOnInit() {
  }

  onSubmit(event: Event): void {
    console.log(this.details);
  }

  isValidForm(): Boolean {
    this.invalidHints = [] as String[];

    if(this.details.city === undefined) {
      this.invalidHints.push("Invalid Address Input");
      this.validForm = false;
    } 

    if(this.details.street === undefined) {
      this.invalidHints.push("Invalid Street Input");
      this.validForm = false;
    }

    if(this.details.state === undefined || this.details.state.length !== 2) {
      this.invalidHints.push("Invalid State Input");
      this.validForm = false;
    }

    if(this.details.post_code === undefined || this.details.post_code > 99999 || this.details.post_code < 10000) {
      this.invalidHints.push("Invalid Zip Code Input");
      this.validForm = false;
    }

    if(this.details.phone_number === undefined || this.details.phone_number > 9999999999 || this.details.post_code < 1000000000) {
      this.invalidHints.push("Invalid Zip Code Input");
      this.validForm = false;
    }

    return this.validForm;
  }

}
