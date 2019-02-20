import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  private TIME_BETWEEN_LOCATION_QUERIES: number = 30000;
  private address: String;
  private name: String;
  private phoneNumber: String;
  private watchId: number;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    if (!this.route.snapshot.paramMap.has('address') || !this.route.snapshot.paramMap.has('name') || !this.route.snapshot.paramMap.has('phone')) {
      this.router.navigate(['/details']);
      return;
    }

    this.address = this.route.snapshot.paramMap.get('address');
    this.name = this.route.snapshot.paramMap.get('name');
    this.phoneNumber = this.route.snapshot.paramMap.get('phone');
    this.setupLocationCollection();
  }

  private setupLocationCollection(): void {
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => this.reverseGeocode(position),
        (error) => console.log(error)
      )
    }, this.TIME_BETWEEN_LOCATION_QUERIES);
  }

  /* 
   * Purpose: Call the Geocoder API, then check if the address from the geocoder matches the destination address
   */
  private reverseGeocode(position: Position) {
    console.log(position);
    // this.reverseGeocodePromise(position).then(
    //   (result) => {
    //     console.log(result)
    //   },
    //   (error) => console.log(error));
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
}
