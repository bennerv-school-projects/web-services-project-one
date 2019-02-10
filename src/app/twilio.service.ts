import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Details } from './details/details';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {

  private twilioSid: string = "AC4e51997237b51b3aa0766048e41130ec";
  private twilioAuthToken: string = "";
  private twilioFromNumber: string = "+17152038200";
  private twilioAuthorizationHeader: string = "";

  private twilioBaseApi : string = "https://api.twilio.com/2010-04-01";
  private twilioSendSmsApi : string = this.twilioBaseApi + "/Accounts/" + this.twilioSid + "/Messages.json";

  constructor(private http: HttpClient) { }

  sendTextMessage(details: Details): Observable<any> {
    var body = {
      "To": "+1" + details.phone_number,
      "From": this.twilioFromNumber,
      "Body": "Will send an alert once Ben has reached " + details.street + " " + details.city + " " + details.state
    };

    console.log("Posting to the twilio api the body:");
    console.log(body);

    return this.http.post(this.twilioSendSmsApi, body);
  }
}
