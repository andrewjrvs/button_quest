import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, combineLatest, zip, Subscription } from 'rxjs';
import {
  filter, map, tap,
  withLatestFrom, combineLatestWith, startWith,
  shareReplay, take

} from 'rxjs/operators'
import { VillanFactoryService } from '../villan-factory.service';
import { GameMechanicsService } from '../game-mechanics.service';
import { Hero, Item, ItemType, Villan } from '../models';
import { isActorDead } from '../utils/actor-util';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit, OnDestroy {

  private _updated = new Subject<null>();
  private _fight = new Subject<null>();
  private _useItem = new Subject<Item>();
  public activeHero$ = this.gameMec.activeHero$.pipe(
    combineLatestWith(this._updated.pipe(startWith(null))),
    map(([dta]) => dta),
    tap(hro => {
      // check if the player died...
      
      if (hro && isActorDead(hro)) {
        this.gameMec.processDeadHero(hro);
        // and redirect to the town;
        this.router.navigate(['town']);
      }
    })
  )

  public villan$ = this.gameMec.activeVillan$.pipe(
    withLatestFrom(this.activeHero$)

    , filter(([e, _]) => !!e)
    , map(([e, h]) => {
      if (e && isActorDead(e)) {
        this.gameMec.loadVillan(this.enemyFactory.getNew(h!.level))
      }
      return e;
    })
    , filter(e => !isActorDead(e as any))
  );

  public activeHero?: Hero;
  public villan?: Villan;
  public healthOptions: Item[] = []

  private unsubscribe: Subscription[] = [];

  constructor(private enemyFactory: VillanFactoryService
    , private gameMec: GameMechanicsService
    , private router: Router) {

  }

  public useHealthItem(itm: Item): void {
    console.log('use heath with ', itm);
    this._useItem.next(itm);
  }

  ionViewDidLeave() {
    this.unsubscribe.forEach(fn => fn.unsubscribe()); 
    // this.activePlayer = undefined;
    this.healthOptions.length = 0;
    // this will clear out the enemy when we leave...
    this.gameMec.clearEnemy();
  }

  ionViewWillEnter() {
    // on first entery we need to generate an enemy
    this.gameMec.activeHero$.pipe(
      filter(ah => !!ah)
      , take(1)
    ).subscribe(hro => {
      this.gameMec.updateVillan(this.enemyFactory.getNew(hro!.level))
    });


    this.unsubscribe.push(
      this._fight.pipe(
        withLatestFrom(this.activeHero$, this.villan$),
        filter(([_, plr, e]) => !!plr && !!e)
      ).subscribe(([_, plr, e]) => {
        // to do, force to indicate exists...
        this.gameMec.fight(plr as any, e as any);
      })
      , this.activeHero$.subscribe(ah => {
        this.activeHero = ah;
        const hx = ah!.sack.items
          .filter(x => x.type === ItemType.HEALTH);
        if (hx.length > 0) {
          hx.forEach(x => {
            if (this.healthOptions.findIndex(u => u.subType === x.subType) < 0) {
              this.healthOptions.push(x);
            }
          });
        } else {
          this.healthOptions.length = 0;
        }
      })
      , this.villan$.subscribe(e => this.villan = e)
      , this._useItem.pipe(
        withLatestFrom(this.activeHero$)
      ).subscribe(([itm, plr]) => {
        const idx = plr?.sack.items.findIndex(x => x.type === itm.type && x.subType === itm.subType);
        console.log('using item', idx, plr);
        if (typeof idx !== 'undefined') {
          plr?.sack.items.splice(idx, 1);
          this.gameMec.processItem(itm, plr!);
        }
        //this.gameMec.
      })
    );
  }

  ngOnDestroy(): void {
    this._fight.complete();
    this._updated.complete();
  }

  ngOnInit(): void {
    // first up lets get a new enemy
    this.gameMec.loadVillan(this.enemyFactory.getNew(1));


  }

  public fight() {
    this._fight.next(null);
  }
}


