import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Details } from './details/details';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {

  private twilioSid: string = "AC4e51997237b51b3aa0766048e41130ec";
  private twilioFromNumber: string = "+17152038200";
  private twilioAuthorizationHeader = new HttpHeaders({ 'Authorization': "" });

  private twilioBaseApi: string = "https://api.twilio.com/2010-04-01";
  private twilioSendSmsApi: string = this.twilioBaseApi + "/Accounts/" + this.twilioSid + "/Messages.json";

  constructor(private http: HttpClient) {
  }

  sendTextMessage(details: Details): Observable<any> {
    const httpOptions = {
      headers: this.twilioAuthorizationHeader
    };

    let formData: FormData = new FormData();
    formData.append("From", this.twilioFromNumber);
    formData.append("To", "+1" + details.phone_number);
    formData.append("Body", details.street + " " + details.city + " " + details.state);

    // return this.http.post(this.twilioSendSmsApi, formData, httpOptions);
    return undefined
  }
}
