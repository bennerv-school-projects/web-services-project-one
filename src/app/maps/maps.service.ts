import { Injectable } from '@angular/core';

import { Details } from '../details/details';
import { } from 'google-maps';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor() { }

  getEstimatedArrival(details: Details, currentLocation: Position): void {
    let service = new google.maps.DistanceMatrixService();
    let origin = new google.maps.LatLng(currentLocation.coords.latitude, currentLocation.coords.longitude);

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [details.street.replace(" ", "+") + details.city.replace(" ", "+") + details.state.replace(" ", "+")],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false
      }, this.callback);
  }

  callback(response, status) {
    console.log(response);
    console.log(status);

  }
}
