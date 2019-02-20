import { Component, OnInit } from '@angular/core';

import { Details } from './details';
import { TwilioService } from '../twilio.service';
import { } from 'google-maps';

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

  constructor(private twilioService: TwilioService) { }

  ngOnInit() { }

  private onSubmit(event: Event): void {
    if (this.isValidForm()) {

      // Get the user's current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = position;
          this.distanceMatrixApiPromise();
        },
        (error) => alert("Failed to get location. Please make sure it's enabled and try again")
      );
    }
  }

  /* 
   * Purpose: Calls the distance matrix API through Google Maps Javascript API.
   * Returns: Promise<any> - the response object from the Distance Matrix Call
   */
  private async callDistanceMatrixApi(): Promise<any> {
    return new Promise((resolve, reject) => {
      let service = new google.maps.DistanceMatrixService();
      let origin = new google.maps.LatLng(this.currentLocation.coords.latitude, this.currentLocation.coords.longitude);

      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [this.details.street.replace(" ", "+") + this.details.city.replace(" ", "+") + this.details.state.replace(" ", "+")],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
          avoidHighways: false,
          avoidTolls: false
        }, function (result, status) {
          if (status.toString() === "OK") {
            resolve(result)
          } else {
            reject(status);
          }
        });
    })
  }

  /* 
   * Purpose: Resolve the promise from the Distance Matrix API Call
   */
  private distanceMatrixApiPromise(): void {
    this.callDistanceMatrixApi().then((result) => {
      let distance, duration;

      // Looking for the data we want in the json response object: result["rows"][0]["elements"][0]["distance"]["text"] and result["rows"][0]["elements"][0]["duration"]["text"]
      try {
        distance = result["rows"][0]["elements"][0]["distance"]["text"];
      } catch (e) {
        console.log(e)
      }
      try {
        duration = result["rows"][0]["elements"][0]["duration"]["text"];
      } catch (e) {
        console.log(e);
      }

      // this.callTwilioApi(distance, duration)
    }, (error) => {
      alert("Failed to query for the desired location");
      console.log(error);
    });
  }


  /* 
   * Purpose: Calls the Twilio Service which calls the API to send a text message
   */
  private callTwilioApi(distance: string, duration: string): void {
    console.log(this.twilioService);
    this.twilioService.sendTextMessage(this.details, distance, duration).subscribe(
      (res) => console.log(res),
      (error) => console.log(error)
    );
  }

  // Check if the form filled out was valid
  private isValidForm(): Boolean {
    this.invalidHints = [] as String[];
    this.validForm = true;

    if (this.details.name === undefined) {
      this.invalidHints.push("Name not provided");
      this.validForm = false;
    }

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
