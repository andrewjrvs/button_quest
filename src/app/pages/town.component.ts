import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subject, Subscription, Unsubscribable } from 'rxjs';
import { Player } from '../models/player';
import { PlayerLibraryService } from '../player-library.service';
import {
  filter, map, tap,
  withLatestFrom, combineLatestWith, startWith,
  shareReplay

} from 'rxjs/operators'
import { GameMecService } from '../game-mec.service';

@Component({
  selector: 'app-town',
  templateUrl: './town.component.html',
  styleUrls: ['./town.component.scss']
})
export class TownComponent implements OnInit, OnDestroy {

  private _updated = new Subject<null>();
  private _rest = new Subject<null>();
  public activePlayer$ = this.plyLibSrv.activePlayer$.pipe(
    tap(console.log.bind(window, 'town ap')),
    tap(plr => {
      if (plr && plr.coin > 0) {
        this.gameMec.addCoin(plr.coin);
        plr.coin -= plr.coin;
        this.plyLibSrv.updatePlayer(plr);
      }
    }),
    combineLatestWith(this._updated.pipe(startWith(null))),
    map(([dta]) => dta),
    //shareReplay()
  );

  public activePlayer?: Player;

  private unsubscribe: Subscription[] = []

  constructor(private plyLibSrv: PlayerLibraryService
              , private gameMec: GameMecService) { }
  
  ngOnDestroy(): void {
    this._rest.complete();
    this._updated.complete();
    this.unsubscribe.forEach(fn => fn.unsubscribe());
  }

  ionViewDidLeave() {
    console.log('removign');
    this._rest.complete();
    this._updated.complete();
    this.unsubscribe.forEach(fn => {
      console.log(fn, 'removing');
      fn.unsubscribe()
    });
    console.log('removed');
  }

  ngOnInit(): void {
    // ugg... why doesn't ionic just let me use 
    // async pipe... but no.. it wont destroy it!!?!
    this.unsubscribe.push(
      this.activePlayer$.subscribe(p => this.activePlayer = p)
    );

    this._rest.pipe(
      withLatestFrom(this.activePlayer$, this.gameMec.user$)
    ).subscribe(([_, plr, usr]) => {
  
      const healthDiff = plr!.fullHealth - plr!.health;
      const rPlr = { ...plr } as Player;
      if (usr.coin < healthDiff) {
        rPlr.health += Number(usr.coin);
        this.gameMec.addCoin(-usr.coin);
      } else {
        rPlr.health = rPlr.fullHealth;
        this.gameMec.addCoin(-1 * healthDiff);
      }
      this.plyLibSrv.updatePlayer(rPlr);
    });
  }

  public rest() {
    this._rest.next(null);
  }

}
