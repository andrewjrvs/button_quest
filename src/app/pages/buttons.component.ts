import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, combineLatest, zip } from 'rxjs';
import {
  filter, map, tap,
  withLatestFrom, combineLatestWith, startWith,
  shareReplay

} from 'rxjs/operators'
import { attack, getEarnedCoin, getEarnedExperience, isDefendableDead } from '../attackable-util';
import { EnemyFactoryService } from '../enemy-factory.service';
import { GameMecService } from '../game-mec.service';
import { Defendable } from '../models/defendable';
import { Enemy } from '../models/emeny';
import { Player } from '../models/player';
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
    shareReplay()
  )


  public enemy$ = this.gameMec.pendingEnemy$.pipe(
    withLatestFrom(this.activePlayer$)

    , filter(([e, _]) => !!e)
    , map(([e, _]) => e)
    , filter(e => !isDefendableDead(e))
    , shareReplay()
  );

  constructor(private plyLibSrv: PlayerLibraryService
    , private enemyFactory: EnemyFactoryService
    , private gameMec: GameMecService) {

  }
  ngOnDestroy(): void {
    this._fight.complete();
    this._updated.complete();
  }

  ngOnInit(): void {
    // first up lets get a new enemy
    this.gameMec.loadEnemy(this.enemyFactory.getNew(1));

    this._fight.pipe(
      withLatestFrom(this.activePlayer$, this.enemy$),
      filter(([_, plr, e]) => !!plr && !!e)
    ).subscribe(([_, plr, e]) => {
      let nplr = enhancePlayerWithItems({ ...plr } as Player);
      const nEnm = attack(nplr, { ...e } as Enemy) as Enemy;

      if (isDefendableDead(nEnm)) {
        const expIncrease = getEarnedExperience(e);
        const coinIncrease = getEarnedCoin(e);
        nplr.coin += coinIncrease;
        nplr.experience += expIncrease;
        this.gameMec.loadEnemy(this.enemyFactory.getNew(nplr?.level || 1)) 
        //this.gameMec.addCoin(coinIncrease);
      } else {
        // Enemy is still alive, so it will reverse the attack...
        // reverse attack...
        nplr = attack(e, nplr) as Player;
        this.gameMec.updateEnemy(nEnm);
      }

      this.plyLibSrv.updatePlayer(nplr);

    })
  }

  public fight() {
    this._fight.next(null);
  }

}
