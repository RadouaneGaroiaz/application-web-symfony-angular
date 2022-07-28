import {Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '../dialog/dialog.component';
import {LevelDialogComponent} from '../level-dialog/level-dialog.component';
import {DOCUMENT} from '@angular/common';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  id: string;
}

@Component({
  selector: 'app-jeu',
  templateUrl: './jeu.component.html',
  styleUrls: ['./jeu.component.css'],
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
        animate('0.3s')
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
    ]),
    trigger('lightTurn', [
      state('light', style({
        backgroundColor: 'yellow',
      })),
      state('noLight', style({
        backgroundColor: 'white',
      })),
      transition('* => noLight', [
        animate('1s')
      ]),
      transition('* => light', [
        animate('1s')
      ])
    ]),
    trigger('lightPlTurn', [
      state('plight', style({
        backgroundColor: 'yellow',
      })),
      state('pNoLight', style({
        backgroundColor: 'white',
      })),
      transition('* => noLight', [
        animate('1s')
      ]),
      transition('* => light', [
        animate('1s')
      ])
    ]),
  ]
})

export class JeuComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
              public dialog: MatDialog,
              public levelDialog: MatDialog,
              // tslint:disable-next-line:variable-name
              @Inject(DOCUMENT) private _document) {
    // Initialisation de la map
    this.map.set(0, new Map());
    this.map.get(0).set(0, '');
    this.map.get(0).set(1, '');
    this.map.get(0).set(2, '');

    this.map.set(1, new Map());
    this.map.get(1).set(0, '');
    this.map.get(1).set(1, '');
    this.map.get(1).set(2, '');

    this.map.set(2, new Map());
    this.map.get(2).set(0, '');
    this.map.get(2).set(1, '');
    this.map.get(2).set(2, '');

    this.finJeu = false;
    this.gagnant = null;
    this.isOpen = true;

    if (history.state.data != null) {
      this.profondeur = history.state.data;
      this.stockProf = history.state.data;
    } else {
      router.navigateByUrl('/level');
    }
    this.nbGame = 0;
    this.playerTurn = true;

    this._document.body.classList.add('bodybg-color');
  }

  /**
   * HTML
   */
  tiles: Tile[] = [
    {text: '', cols: 1, rows: 1, color: 'red', id: '0,0'},
    {text: '', cols: 1, rows: 1, color: 'red', id: '0,1'},
    {text: '', cols: 1, rows: 1, color: 'red', id: '0,2'},
    {text: '', cols: 1, rows: 1, color: 'red', id: '1,0'},
    {text: '', cols: 1, rows: 1, color: 'red', id: '1,1'},
    {text: '', cols: 1, rows: 1, color: 'red', id: '1,2'},
    {text: '', cols: 1, rows: 1, color: 'red', id: '2,0'},
    {text: '', cols: 1, rows: 1, color: 'red', id: '2,1'},
    {text: '', cols: 1, rows: 1, color: 'red', id: '2,2'},
  ];

  isOpen: boolean;
  playerTurn: boolean;


  /**
   * Attributs
   */
  private map = new Map(); // Map représentant le plateau du jeu 3x3
  profondeur; // Profondeur choisi par le joueur
  private stockProf;

  // Constante max/min/initiale
  private MAX = 100000;
  private MIN = -100000;
  private INITIALE = 0;

  // Value Player & IA
  private PLAYERVALUE = 'O';
  private IAVALUE = 'X';

  private playerNow; // Joueur en cours
  private nbCaseDispo = 9; // Nb de case encore disponible
  private finJeu;
  private gagnant;
  private nbGame;
  private score;


  ngOnInit(): void {
    this._document.body.classList.add('bodybg-color');
  }

  ngOnDestroy(): void {
    this._document.body.classList.add('bodybg-color');
  }

  /**
   * HTML functions
   */
  openDialog(value) {
    this.dialog.open(DialogComponent, {
      data: {
        val: value,
        jeu: this,
        score: this.score
      },
      disableClose: true,
      minWidth: '300px',
      minHeight: '300px'
    });
  }

  refresh() {
    // Initialisation de la map
    this.map.set(0, new Map());
    this.map.get(0).set(0, '');
    this.map.get(0).set(1, '');
    this.map.get(0).set(2, '');

    this.map.set(1, new Map());
    this.map.get(1).set(0, '');
    this.map.get(1).set(1, '');
    this.map.get(1).set(2, '');

    this.map.set(2, new Map());
    this.map.get(2).set(0, '');
    this.map.get(2).set(1, '');
    this.map.get(2).set(2, '');

    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        document.getElementById(i + ',' + j).childNodes[0].textContent = '  ';
      }
    }

    this.finJeu = false;
    this.nbCaseDispo = 9;

    this.dialog.closeAll();
    this.levelDialog.open(LevelDialogComponent, {
      data: {
        jeu : this,
        score : this.score
      },
      disableClose: true
    });
  }

  /**
   * Getters & Setters
   */
  setPlayerNow(value: string) {
    this.playerNow = value;
  }

  setLevel(level: number) {
    this.profondeur = level;
  }

  isEmpty(x: number, y: number) {
    return this.map.get(x).get(y) === '';
  }

  /**
   * Le jeu est fini si un joueur a alligné 3 pions en horizontal, vertical ou en diagonal.
   * Ou si aucune case n'est disponible
   */
  isFinish() {
    this.finJeu = true; // On init finJeu à VRAI et on le remet à faux si on ne rempli aucune condition.

    for (let i = 0; i < 3; ++i) {
      // Horizontal
      if (!this.isEmpty(i, 0)) {
        // Test si (i, 0), (i, 1), (i, 2) sont du même type
        if ( (this.map.get(i).get(0) === this.map.get(i).get(1)) && (this.map.get(i).get(0) === this.map.get(i).get(2)) ) {
          this.gagnant = this.map.get(i).get(0);
          return true;
        }
      }

      // Vertical
      if (!this.isEmpty(0, i)) {
        // Test si (i, 0), (i, 1), (i, 2) sont du même type
        if ( (this.map.get(0).get(i) === this.map.get(1).get(i)) && (this.map.get(0).get(i) === this.map.get(2).get(i)) ) {
          this.gagnant = this.map.get(0).get(i);
          return true;
        }
      }
    }

    // Diagonale 1
    if (!this.isEmpty(0, 0)) {
      if ( (this.map.get(0).get(0) === this.map.get(1).get(1)) && (this.map.get(0).get(0) === this.map.get(2).get(2)) ) {
        this.gagnant = this.map.get(0).get(0);
        return true;
      }
    }

    // Diagonale 2
    if (!this.isEmpty(0, 2)) {
      if ( (this.map.get(0).get(2) === this.map.get(1).get(1)) && (this.map.get(0).get(2) === this.map.get(2).get(0)) ) {
        this.gagnant = this.map.get(0).get(2);
        return true;
      }
    }

    // Si aucun gagant -> toutes les cases occupées
    if (this.nbCaseDispo === 0) {
      this.gagnant = null;
      return true;
    }

    // On retourne faux par défaut si aucune combinaison n'est gagnante.
    this.finJeu = false;
    return this.finJeu;
  }


  /**
   * Fonction de calcule du coup de l'IA
   * Algorithme Max-Min de base transformé en algorithme Alpha-Beta
   */
  private calculIA(idCase) {
    let i;
    let j;
    let tmp;
    let maxI = -1;
    let maxJ = -1;
    const alpha = this.MIN;
    const beta = this.MAX;
    let max = this.MIN;
    const prof = this.profondeur;

    if (this.profondeur !== 0 || this.isFinish()) {
      for (i = 0; i < 3; ++i) {
        for (j = 0; j < 3; ++j) {
          if (this.isEmpty(i, j)) {
            this.map.get(i).set(j, this.IAVALUE); // Coup temporaire de test qu'on annule après
            tmp = this.calculMin(prof - 1, alpha, beta);
            console.log('tmp', i, j, prof, tmp);

            if (max < tmp) {
              max = tmp;
              maxI = i;
              maxJ = j;
            }
            if (max === this.MIN) {
              maxI = i;
              maxJ = j;
            }

            // Annulation du coup joué
            this.map.get(i).set(j, '');
          }
        }
      }
    }
    this.map.get(maxI).set(maxJ, this.IAVALUE);
    const caseJeu = document.getElementById(maxI + ',' + maxJ).childNodes[0].textContent = this.playerNow;
  }

  private calculMin(prof: number, alpha, beta) {
    let i = 0;
    let j = 0;
    let tmp;


    if (prof === 0 || this.isFinish()) {
      console.log('MIN', this.evaluation());
      return this.evaluation();
    }

    for (i = 0; i < 3; ++i) {
      for (j = 0; j < 3; ++j) {
        if (this.isEmpty(i, j)) {
          this.map.get(i).set(j, this.IAVALUE); // Coup temporaire de test qu'on annule après
          console.log(prof);
          tmp = this.calculMax(prof - 1, alpha, beta);
          // Annulation du coup joué
          this.map.get(i).set(j, '');

          if (tmp < beta) {
            beta = tmp;
          }
          if (beta <= alpha) {
            return beta;
          }
        }
      }
    }
    return beta;
  }

  private calculMax(prof: number, alpha, beta) {
    let i = 0;
    let j = 0;
    let tmp;

    if (prof === 0 || this.isFinish()) {
      console.log('MAX', this.evaluation());
      return this.evaluation();
    }

    for (i = 0; i < 3; ++i) {
      for (j = 0; j < 3; ++j) {
        if (this.isEmpty(i, j)) {
          this.map.get(i).set(j, this.IAVALUE); // Coup temporaire de test qu'on annule après
          console.log(prof);
          tmp = this.calculMin(prof - 1, alpha, beta);
          // Annulation du coup joué
          this.map.get(i).set(j, '');

          if (tmp > alpha) {
            alpha = tmp;
          }
          if (beta <= alpha) {
            return alpha;
          }
        }
      }
    }
    return alpha;
  }

  /**
   * Section du calcul du score
   */

  calcScore(cptpion: number, cptjoueur: number) {
    switch (cptpion) {
    case 1:
      return 10 * cptjoueur;
    case 2:
      return 30 * cptjoueur;
    default:
      return 0;
    }
  }


  evaluation() {
    let cptjoueur;
    let cptpion;
    let score = 0;

    if (this.isFinish()) {
      if (this.gagnant === this.playerNow) { // IA win
        return 1000 - (9 - this.nbCaseDispo);
      } else if (this.gagnant == null) { // Egalité
        return 0;
      } else { // IA lose
        return -1000 + (9 - this.nbCaseDispo);
      }
    }

    cptpion = 0;
    cptjoueur = 0;
    // Diagonale 1
    for (let i = 0; i < 3; ++i) {
      if (!this.isEmpty(i, i)) {
        cptpion++;
        if (this.map.get(i).get(i) === this.playerNow) {
          cptjoueur++;
        } else {
          cptjoueur--;
        }
      }
    }
    score += this.calcScore(cptpion, cptjoueur);

    cptpion = 0;
    cptjoueur = 0;
    // Diagonale 2
    for (let i = 0; i < 3; ++i) {
      if (!this.isEmpty(i, 2 - i)) {
        cptpion++;
        if (this.map.get(i).get(2 - i) === this.playerNow) {
          cptjoueur++;
        } else {
          cptjoueur--;
        }
      }
    }
    score += this.calcScore(cptpion, cptjoueur);

    // Horizontale
    for (let i = 0; i < 3; ++i) {
      cptpion = 0;
      cptjoueur = 0;
      for (let j = 0; j < 3; ++j) {
        if (!this.isEmpty(i, j)) {
          cptpion++;
          if (this.map.get(i).get(j) === this.playerNow) {
            cptjoueur++;
          } else {
            cptjoueur--;
          }
        }
      }
      score += this.calcScore(cptpion, cptjoueur);
    }


    // Verticale
    for (let i = 0; i < 3; ++i) {
      cptjoueur = 0;
      cptpion = 0;
      for (let j = 0; j < 3; ++j) {
        if (!this.isEmpty(j, i)) {
          cptpion++;
          if (this.map.get(j).get(i) === this.playerNow) {
            cptjoueur++;
          } else {
            cptjoueur--;
          }
        }
      }
      score += this.calcScore(cptpion, cptjoueur);
    }

    console.log(score);
    return score;
  }

  jouerCoup(event) {
    if (event.target.textContent.length === 2 && this.playerTurn && !this.isFinish()) { // Si coup pas déjà joué
      this.setPlayerNow(this.PLAYERVALUE);
      event.target.textContent = this.playerNow;

      // ID de la case et maj de la map
      const idCase = event.currentTarget.id;
      const ind1 = Number(idCase.substring(0, 1));
      const ind2 = Number(idCase.substring(2));
      this.map.get(ind1).set(ind2, this.playerNow);
      this.nbCaseDispo--;

      if (this.isFinish()) {
        this.endGame();
      } else { // Quand le joueur a joué, l'IA joue
        this.playerTurn = false;
        setTimeout( () => {
            this.setPlayerNow(this.IAVALUE);
            this.calculIA(ind1 + ',' + ind2);
            this.nbCaseDispo--;

            if (this.isFinish()) {
              this.endGame();
            }
            this.playerTurn = true;
          },
          600);
      }
    }
  }

  endGame() {
    this.nbGame++;
    if (this.gagnant === this.PLAYERVALUE) {
      this.score = (1000 - (9 - this.nbCaseDispo)) * this.profondeur;
      this.openDialog('Vous avez gagné !');
    } else if (this.gagnant === this.IAVALUE) {
      this.score = (1000 - ((9 - this.nbCaseDispo) * 10)) * this.profondeur;
      this.openDialog('Vous avez perdu !');
    } else {
      this.score = 500;
      this.openDialog('Match nul !');
    }
    console.log(this.profondeur);
    console.log('Score jeu', this.score);
    document.getElementById('item_gameCount').textContent = 'Nombre de parties jouées : ' + this.nbGame;
  }

}
