import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TwilioService } from '../twilio.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  private TIME_BETWEEN_LOCATION_QUERIES: number = 30000;
  private street: string;
  private city: string;
  private state: string;
  private name: string;
  private phoneNumber: string;
  private intervalId: NodeJS.Timer;

  constructor(private router: Router, private route: ActivatedRoute, private twilioService: TwilioService) { }

  ngOnInit() {
    if (!this.route.snapshot.paramMap.has('street') || !this.route.snapshot.paramMap.has('city') || !this.route.snapshot.paramMap.has('state') || !this.route.snapshot.paramMap.has('name') || !this.route.snapshot.paramMap.has('phone')) {
      this.router.navigate(['/details']);
      return;
    }

    this.street = this.route.snapshot.paramMap.get('street');
    this.city = this.route.snapshot.paramMap.get('city');
    this.state = this.route.snapshot.paramMap.get('state');
    this.name = this.route.snapshot.paramMap.get('name');
    this.phoneNumber = this.route.snapshot.paramMap.get('phone');
    this.setupLocationCollection();
  }

  /*
   * Purpose: Sets up an interval for querying the google geocoder api
   */
  private setupLocationCollection(): void {
    this.intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => this.reverseGeocode(position),
        (error) => console.error(error)
      )
    }, this.TIME_BETWEEN_LOCATION_QUERIES);
  }

  /* 
   * Purpose: Call the Geocoder API, then check if the address from the geocoder matches the destination address
   */
  private reverseGeocode(position: Position) {
    this.reverseGeocodePromise(position).then(
      (result) => {
        // Geocode API Result: 

        // TODO: Uncomment
        // console.log(result)
        Object.keys(result).forEach((addressIndexKey) => {
          Object.keys(result[addressIndexKey]).forEach((formattedAddressKey) => {
            if (formattedAddressKey.toLowerCase() === "formatted_address") {
              if (this.compareAddress(result[addressIndexKey][formattedAddressKey])) {
                clearInterval(this.intervalId);
                if (this.twilioService.sendTextMessage(this.phoneNumber, this.name)) {
                  this.router.navigate(['success']);
                  return;
                }
              }
            }
          })
        });
      },
      (error) => console.error(error));
  }

  /*
   * Purpose: Call the Google Maps Reverse Geocoder API
   * Return: A promise with the reponse from Google's API
   */
  async reverseGeocodePromise(position: Position): Promise<any> {
    var coordinates = position.coords;
    return new Promise((resolve, reject) => {
      let geocoder = new google.maps.Geocoder;

      let request = {
        'location': {
          'lat': coordinates.latitude,
          'lng': coordinates.longitude
        }
      };

      geocoder.geocode(request, function (result, status) {
        if (status.toString() === "OK") {
          resolve(result);
        } else {
          reject(status);
        }
      })
    });
  }

  /*
   * Purpose: Compare the destination address to the current address received by the reverse geocoder API
   * Returns: true if
   */
  private compareAddress(navigatedAddress: string): boolean {
    let navigatedAddressParts = navigatedAddress.split(',');

    // Need a street, city, and state to compare against
    if (navigatedAddressParts.length < 3) {
      return;
    }

    // index 0 is the street
    if (!navigatedAddressParts[0].toUpperCase().includes(this.street.toUpperCase())) {
      return false;
    }

    // index 1 is the city
    if (!navigatedAddressParts[1].toUpperCase().includes(this.city.toUpperCase())) {
      return false
    }

    // index 2 is state and zip
    if (!navigatedAddressParts[2].toUpperCase().includes(this.state.toUpperCase())) {
      return false
    }

    return true;
  }
}
