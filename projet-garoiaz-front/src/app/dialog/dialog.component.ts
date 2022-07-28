import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {JeuComponent} from '../jeu/jeu.component';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormControl, Validators} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';

export interface DialogData {
  winner: 'X' | 'O';
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  /**
   * Attributs
   */
  token = false;
  jeu: JeuComponent;
  value: string;
  score: number;
  pseudoControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(18)
  ]);
  randValue = [
    'Gandalf le gris',
    'Hello kitty',
    'Harry Potter',
    'Frodon',
    'Aragorn',
    'Sauron'
  ];
  aleaValue;
  player;

  constructor(@Inject (MAT_DIALOG_DATA) public data,
              public router: Router, public http: HttpClient) {
    this.jeu = data.jeu;
    this.score = data.score;
    console.log('Score dialog', this.score);
  }

  ngOnInit(): void {
    this.aleaValue = this.randValue[Math.floor(Math.random() * this.randValue.length)];
  }

  refresh() {
    this.jeu.refresh();
  }

  home() {
    this.router.navigateByUrl('/');
  }

  addScore() {
    let players;
    let playerValue;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/merge-patch+json'
      })
    };

    let exist = false;

    this.http.get('https://127.0.0.1:8000/api/players').subscribe(res => {
      players = res;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < players.length; ++i) {
        if (players[i].name === this.value) {
          exist = true;
          playerValue = players[i];
        }
      }
      if (!exist) { // Ajout du joueur s'il n'existe pas
        this.http.post('https://127.0.0.1:8000/apip/players', {
          name: this.value
        }).subscribe(res2 => {
          this.player = res2;
          this.http.patch('https://127.0.0.1:8000/apip/players/' + this.player.id, {
            name: this.value,
            scores: [this.score]
          }, httpOptions).subscribe(res3 => {
          });
        });
      } else {
        console.log('https://127.0.0.1:8000/api/player/' + this.value);
        this.http.get('https://127.0.0.1:8000/api/player/' + this.value).subscribe(res4 => {
          this.player = res4[0];
          this.http.patch('https://127.0.0.1:8000/apip/players/' + this.player.id, {
            name: this.value,
            scores: [this.score]
          }, httpOptions).subscribe(res3 => {
          });
        });
      }
    });

    this.jeu.refresh();
  }
}
