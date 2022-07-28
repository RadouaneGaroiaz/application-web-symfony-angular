import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSort, Sort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, count, map, startWith, switchMap} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {MatDialogConfig} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['name', 'scores'];
  // displayedColumns: string[] = ['id', 'name', 'scores'];
  players: any = [];
  data: PlayerIssue[] = [];
  dataSource;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  matDialogConfig: MatDialogConfig;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private http: HttpClient,
              // tslint:disable-next-line:variable-name
              @Inject(DOCUMENT) private _document) { }

  ngOnInit(): void {
    this._document.body.classList.add('bodybg-color');

  }

  ngOnDestroy(): void {
    this._document.body.classList.add('bodybg-color');
  }


  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.getPlayers();
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;

          return this.players;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe(data => {
        this.data = data;
      });
  }

  getPlayers() {
    this.http.get('https://127.0.0.1:8000/api/players').subscribe(res => {
      this.players = res;
    });

    return this.http.get<PlayersApi>('https://127.0.0.1:8000/api/players');
  }

}
export interface PlayerIssue {
  id: string;
  name: string;
  scores: Array<number>;
}

export interface PlayersApi {
  items: PlayerIssue[];
  total_count: number;
}
