import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {JeuComponent} from './jeu/jeu.component';
import {LevelComponent} from './level/level.component';
import {ScoreComponent} from './score/score.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'level', component: LevelComponent},
  {path: 'jeu', component: JeuComponent},
  {path: 'score', component: ScoreComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
