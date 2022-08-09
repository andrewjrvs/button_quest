import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, combineLatest, zip, Subscription } from 'rxjs';
import {
  filter, map, tap,
  withLatestFrom, combineLatestWith, startWith,
  shareReplay, take

} from 'rxjs/operators'
import { attack, getEarnedCoin, getEarnedExperience, isDefendableDead } from '../attackable-util';
import { EnemyFactoryService } from '../enemy-factory.service';
import { GameMecService } from '../game-mechanics.service';
import { Defendable } from '../models/defendable';
import { Enemy } from '../models/emeny';
import { Player } from '../models/hero';
import { PlayerLibraryService } from '../player-library.service';
import { enhancePlayerWithItems, findLevelFromExperience, getExpBaseForLevel, levelUpPlayer } from '../player-util';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit, OnDestroy {

  private _updated = new Subject<null>();
  private _fight = new Subject<null>();
  public activePlayer$ = this.plyLibSrv.activePlayer$.pipe(
    map(plr => {
      if (plr && !plr?.level) {
        plr.level = 1;
      }
      if (plr && !plr?.nextLevelExperience) {
        plr.baseLevelExperience = getExpBaseForLevel((plr?.level || 1))
        plr.nextLevelExperience = getExpBaseForLevel((plr?.level || 1) + 1);
      }
      return plr;
    }),
    combineLatestWith(this._updated.pipe(startWith(null))),
    map(([dta]) => dta),
  )

  public enemy$ = this.gameMec.pendingEnemy$.pipe(
    withLatestFrom(this.activePlayer$)

    , filter(([e, _]) => !!e)
    , map(([e, _]) => e)
    , filter(e => !isDefendableDead(e as any))
  );

  public activePlayer?: Player;
  public enemy?: Enemy;

  private unsubscribe: Subscription[] = [];

  constructor(private plyLibSrv: PlayerLibraryService
    , private enemyFactory: EnemyFactoryService
    , private gameMec: GameMecService
    , private router: Router) {

  }

  ionViewDidLeave() {
    this.unsubscribe.forEach(fn => fn.unsubscribe()); 
    // this.activePlayer = undefined;

    // this will clear out the enemy when we leave...
    this.gameMec.clearEnemy();
  }

  ionViewWillEnter() {
    // on first entery we need to generate an enemy
    this.plyLibSrv.activePlayer$.pipe(take(1)).subscribe(ap => {
      this.gameMec.updateEnemy(this.enemyFactory.getNew(ap?.level || 1))
    });

    this.unsubscribe.push(
      this._fight.pipe(
        withLatestFrom(this.activePlayer$, this.enemy$),
        filter(([_, plr, e]) => !!plr && !!e)
      ).subscribe(this.__struggle.bind(this))
    );
    this.unsubscribe.push(
      this.activePlayer$.subscribe(ap => this.activePlayer = ap)
      , this.enemy$.subscribe(e => this.enemy = e)
    );
  }

  ngOnDestroy(): void {
    this._fight.complete();
    this._updated.complete();
  }

  ngOnInit(): void {
    // first up lets get a new enemy
    this.gameMec.loadEnemy(this.enemyFactory.getNew(1));


  }

  public fight() {
    this._fight.next(null);
  }

  private __struggle([_, plr, e]: [null, Player | undefined, Enemy | undefined]) {
    let nplr = enhancePlayerWithItems({ ...plr } as Player);
    const nEnm = attack(nplr, { ...e } as Enemy) as Enemy;



    if (isDefendableDead(nEnm)) {
      const expIncrease = getEarnedExperience(nEnm);
      const coinIncrease = getEarnedCoin(nEnm);
      nplr.coin += coinIncrease;
      nplr.experience += expIncrease;
      this.gameMec.loadEnemy(this.enemyFactory.getNew(nplr?.level || 1)) 
    } else {
      // Enemy is still alive, so it will reverse the attack...
      // reverse attack...
      nplr = attack(nEnm, nplr) as Player;

      // check if player is dead!?
      if (isDefendableDead(nplr)) {
        // then loose have their all their gold, 
        // set exp to the base for their level,
        // heal all the way, and send them to town
        nplr.health = nplr.fullHealth;
        nplr.coin = nplr.coin < 10 ? nplr.coin : nplr.coin / BigInt(2);
        nplr.experience = nplr.baseLevelExperience || 0;
        this.gameMec.sendGameMessage(`${nplr.name || 'Active'} Player Died.`, 'skull' )
        this.router.navigate(['town']);
      }

      // update enemy (since he's still alive)
      this.gameMec.updateEnemy(nEnm);
    }

    this.plyLibSrv.updatePlayer(nplr);

  }

}
