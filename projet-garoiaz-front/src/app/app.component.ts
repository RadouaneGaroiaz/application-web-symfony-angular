import {Component, HostBinding, Inject, OnDestroy, OnInit} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import {RouterOutlet} from '@angular/router';
import {DOCUMENT} from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'projet-garoiaz-front';

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
