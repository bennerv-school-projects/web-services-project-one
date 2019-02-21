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
  private twilioBaseApi: string = "https://api.twilio.com/2010-04-01";
  private twilioSendSmsApi: string = this.twilioBaseApi + "/Accounts/" + this.twilioSid + "/Messages";

  constructor(private http: HttpClient) { }

  /*
   * Purpose: Sends the initial query to the Twilio API to send out a text message
   * Returns: A boolean indicating whether it was able to send a text message successfully
   */
  public sendInitialTextMessage(details: Details, distance: string, duration: string): boolean {
    let formData: FormData = new FormData();
    formData.append("From", this.twilioFromNumber);
    formData.append("To", "+1" + details.phone_number);
    formData.append("Body", details.name + " will reach " + details.street + " " + details.city + " " + details.state + " in approximately " + duration + ". Approximate distance: " + distance);

    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", this.twilioSendSmsApi, false);
    xhttp.setRequestHeader("Authorization", "Basic ");
    xhttp.send(formData);

    console.log(xhttp.responseXML);

    let document: Document = xhttp.responseXML;
    if (document.getElementsByTagName('Status')[0].innerHTML.toString() == "queued") {
      return true;
    } else {
      return false;
    }
  }

  /*
   * Purpose: Sends the initial query to the Twilio API to send out a text message
   * Returns: A boolean indicating whether it was able to send a text message successfully
   */
  public sendTextMessage(phoneNumber: string, name: string): boolean {
    let formData: FormData = new FormData();
    formData.append("From", this.twilioFromNumber);
    formData.append("To", "+1" + phoneNumber);
    formData.append("Body", name + " has made it to their destination! Thanks for using Text Me When You Get There");

    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", this.twilioSendSmsApi, false);
    xhttp.setRequestHeader("Authorization", "Basic ");
    xhttp.send(formData);

    // console.log(xhttp.responseXML);

    let document: Document = xhttp.responseXML;
    if (document.getElementsByTagName('Status')[0].innerHTML.toString() == "queued") {
      return true;
    } else {
      return false;
    }
  }
}
