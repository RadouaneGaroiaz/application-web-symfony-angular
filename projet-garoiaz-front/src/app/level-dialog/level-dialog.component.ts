import {Component, Inject, OnInit} from '@angular/core';
import {JeuComponent} from '../jeu/jeu.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-level-dialog',
  templateUrl: './level-dialog.component.html',
  styleUrls: ['./level-dialog.component.css']
})
export class LevelDialogComponent implements OnInit {

  /**
   * Attributs
   */
  jeu: JeuComponent;

  constructor(@Inject (MAT_DIALOG_DATA) public data) {
    this.jeu = data.jeu;
  }

  ngOnInit(): void {
  }

  setLevel(level: number) {
    this.jeu.setLevel(level);
  }
}
