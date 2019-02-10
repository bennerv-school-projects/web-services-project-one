import { Component, OnInit } from '@angular/core';

import { Details } from './details';
import { TwilioService } from '../twilio.service';
import { MapsService } from '../maps/maps.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  private details: Details = {};
  private validForm = true;
  private invalidHints: String[] = [];
  private currentLocation: Position;

  constructor(private twilioService: TwilioService, private mapsService: MapsService) { }

  ngOnInit() { }

  onSubmit(event: Event): void {
    if (this.isValidForm()) {

      // Get the user's current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = position;
          this.callDistanceMatrixApi();
        },
        (error) => alert("Failed to get location. Please make sure it's enabled and try again")
      );
    }
  }

  callDistanceMatrixApi(): void {
    // Call the Distance Matrix API
    console.info(this.currentLocation);
    this.mapsService.getEstimatedArrival(this.details, this.currentLocation);
  }

  callTwilioApi(): void {
    this.twilioService.sendTextMessage(this.details).subscribe(
      (res) => console.log(res),
      (error) => console.log(error)
    );
  }

  // Check if the form filled out was valid
  isValidForm(): Boolean {
    this.invalidHints = [] as String[];
    this.validForm = true;

    if (this.details.city === undefined) {
      this.invalidHints.push("Invalid Address Input");
      this.validForm = false;
    }

    if (this.details.street === undefined) {
      this.invalidHints.push("Invalid Street Input");
      this.validForm = false;
    }

    if (this.details.state === undefined || this.details.state.length !== 2) {
      this.invalidHints.push("Invalid State Input");
      this.validForm = false;
    }

    if (this.details.post_code === undefined || this.details.post_code > 99999 || this.details.post_code < 10000) {
      this.invalidHints.push("Invalid Zip Code Input");
      this.validForm = false;
    }

    if (this.details.phone_number === undefined || this.details.phone_number > 9999999999 || this.details.phone_number < 1000000000) {
      this.invalidHints.push("Invalid Phone Number Input");
      this.validForm = false;
    }

    return this.validForm;
  }
}
