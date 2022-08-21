import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject, Subject, Subscription, Unsubscribable } from 'rxjs';
import { Bank, Hero } from '../models';
import {
  filter, map, tap,
  withLatestFrom, combineLatestWith, startWith,
  shareReplay

} from 'rxjs/operators'
import { GameMechanicsService } from '../game-mechanics.service';
import { StoreComponent } from '../store/store.component';

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
      if (plr && plr.sack.coin > 0 && (plr.property && plr.property['autoDeposit'])) {
        this.gameMec.addCoin(plr.sack.coin);
        plr.sack.coin -= plr.sack.coin;
        this.gameMec.updatePlayer(plr);
      }
    }),
    combineLatestWith(this._updated.pipe(startWith(null))),
    map(([dta]) => dta),
  );

  public bank$ = this.gameMec.bank$;
  

  @ViewChild('store') storeComp?: StoreComponent;

  public activePlayer?: Hero;

  public bank?: Bank;

  private unsubscribe: Subscription[] = []

  constructor(private gameMec: GameMechanicsService) { }
  
  ngOnDestroy(): void {
    this._rest.complete();
    this._updated.complete();
    this.unsubscribe.forEach(fn => fn.unsubscribe() );
  }

  ionViewDidLeave() {
    this.unsubscribe.forEach(fn => fn.unsubscribe()); 
    this.unsubscribe.length = 0;
    this.storeComp && this.storeComp.close();
    this.activePlayer = undefined;
    this.bank = undefined;
  }

  ionViewWillEnter() {

    // ugg... why doesn't ionic just let me use
    // async pipe... but no.. it wont destroy it!!?!
    this.unsubscribe.push(
      this.activePlayer$
        .subscribe(p => this.activePlayer = p)
      , this.gameMec.bank$.subscribe(b => this.bank = b)
      
    );

    this.unsubscribe.push(
      this._rest.pipe(
        withLatestFrom(this.activePlayer$),
      ).subscribe(([_, plr]) => {
        // to do... needs fixing...
        this.gameMec.rest([plr as any]);
      })
    );

    this.storeComp && this.storeComp.open();
  }

  ngOnInit(): void {
    
  }

  public rest() {
    this._rest.next(null);
  }

  public bankCoinChange(dir: 'w' | 'd', amt: bigint): void {
    if (this.activePlayer && this.bank) {
      if (dir === 'w') {
        this.gameMec.addCoin(-1n * amt);
        this.activePlayer.sack.coin += amt;
        this.gameMec.updatePlayer(this.activePlayer);
      } else {
        this.gameMec.addCoin(amt);
        this.activePlayer.sack.coin -= amt;
        this.gameMec.updatePlayer(this.activePlayer);
      }
    }
  }
}
