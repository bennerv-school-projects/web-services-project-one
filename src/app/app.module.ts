import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DetailsComponent } from './details/details.component';
import { LocationComponent } from './location/location.component';
import { SuccessComponent } from './success/success.component';

const appRoutes: Routes = [
  { path: 'details', component: DetailsComponent },
  { path: 'locate', component: LocationComponent },
  { path: 'success', component: SuccessComponent },
  { path: '', redirectTo: 'details', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    DetailsComponent,
    LocationComponent,
    SuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
