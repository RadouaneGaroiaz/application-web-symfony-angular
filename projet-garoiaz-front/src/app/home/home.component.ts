import {Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {DOCUMENT} from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: '1'
      })),
      state('closed', style({
        opacity: '0'
      })),
      transition('open => closed', [
        animate('0ms')
      ]),
      transition('closed => open', [
        animate('1s ease-in', keyframes([
          style({opacity: 0, offset: 0}),
          style({opacity: 0.5, offset: 0.5}),
          style({opacity: 1, offset: 1.0})
          ])
        )
      ]),
    ]),
    trigger('disableButton', [
      state('enable', style({
      })),
      state('disable', style({
        animation: 'none',
        visibility: 'hidden'
      })),
      transition('enable => disable', [
        animate('1s')
      ])
    ])
  ]
})

export class HomeComponent implements OnInit, OnDestroy {

  isOn = false;

  isOpen = false;
  disable = false;

  // tslint:disable-next-line:variable-name
  constructor(@Inject(DOCUMENT) private _document) { }

  ngOnInit(): void {
    this._document.body.classList.add('bodybg-color');
  }

  ngOnDestroy(): void {
    this._document.body.classList.add('bodybg-color');
  }

  toogle() {
    this.isOpen = !this.isOpen;
    this.disable = !this.disable;
    document.getElementById('homeGrid').remove();
  }
}
