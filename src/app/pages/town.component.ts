import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subject, Subscription, Unsubscribable } from 'rxjs';
import { Hero } from '../models';
import {
  filter, map, tap,
  withLatestFrom, combineLatestWith, startWith,
  shareReplay

} from 'rxjs/operators'
import { GameMechanicsService } from '../game-mechanics.service';

@Component({
  selector: 'app-town',
  templateUrl: './town.component.html',
  styleUrls: ['./town.component.scss']
})
export class TownComponent implements OnInit, OnDestroy {

  private _updated = new Subject<null>();
  private _rest = new Subject<null>();
  public activePlayer$ = this.gameMec.activeHero$.pipe(
    tap(plr => {
      if (plr && plr.sack.coin > 0) {
        this.gameMec.addCoin(plr.sack.coin);
        plr.sack.coin -= plr.sack.coin;
        this.gameMec.updatePlayer(plr);
      }
    }),
    combineLatestWith(this._updated.pipe(startWith(null))),
    map(([dta]) => dta),
  );

  public activePlayer?: Hero;

  private unsubscribe: Subscription[] = []

  constructor(private gameMec: GameMechanicsService) { }
  
  ngOnDestroy(): void {
    this._rest.complete();
    this._updated.complete();
    this.unsubscribe.forEach(fn => fn.unsubscribe() );
  }

  ionViewDidLeave() {
    this.unsubscribe.forEach(fn => fn.unsubscribe()); 
    this.activePlayer = undefined;
  }

  ionViewWillEnter() {

    // ugg... why doesn't ionic just let me use
    // async pipe... but no.. it wont destroy it!!?!
    this.unsubscribe.push(
      this.activePlayer$
        .subscribe(p => this.activePlayer = p)
    );

    this.unsubscribe.push(
      this._rest.pipe(
        withLatestFrom(this.activePlayer$),
      ).subscribe(([_, plr]) => {
        // to do... needs fixing...
        this.gameMec.rest([plr as any]);
      })
    );
  }

  ngOnInit(): void {
    
  }

  public rest() {
    this._rest.next(null);
  }

}
