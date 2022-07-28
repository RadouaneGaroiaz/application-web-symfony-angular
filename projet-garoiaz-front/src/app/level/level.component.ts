import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: '1'
      })),
      state('closed', style({
        opacity: '0'
      })),
      transition('open => closed', [
        animate('2s')
      ]),
      transition('closed => open', [
        animate('1s')
      ]),
    ]),
  ]
})
export class LevelComponent implements OnInit, OnDestroy {

  isOpen: boolean;

  // tslint:disable-next-line:variable-name
  constructor(@Inject(DOCUMENT) private _document) {
    this._document.body.classList.add('bodybg-color');
    this.isOpen = true;
  }

  ngOnInit(): void {
    this._document.body.classList.add('bodybg-color');
  }

  ngOnDestroy(): void {
    this._document.body.classList.add('bodybg-color');
  }

}
