import { Injectable } from '@angular/core';
import { BehaviorSubject, map, ReplaySubject, Subject, combineLatestWith } from 'rxjs';
import { Bank, Hero, MessageResponse, Villan } from './models';
import * as SysUtil from './utils/system-util';

@Injectable({
  providedIn: 'root'
})
export class GameMechanicsService {

  private _heroList = new BehaviorSubject<Hero[]>([]);
  public heroList$ = this._heroList.asObservable();
  
  private _activeHeroIdx = new BehaviorSubject<number>(0);
  public heroIndex$ = this._activeHeroIdx.asObservable();

  public activeHero$ = this._activeHeroIdx.pipe(
    combineLatestWith(this._heroList),
    map(([idx, playerList]) => {
      if (playerList.length < 1 ||
          idx > (playerList.length - 1)) {
        return undefined;
      } 
      return playerList[idx];
    })
  );

  private _bank = new BehaviorSubject<Bank | null>(null);
  public bank$ = this._bank.asObservable();

  private _villan = new ReplaySubject<Villan | null>(1);
  public activeVillan$ = this._villan.asObservable();

  private _gameMessage = new Subject<[string, string?, string?]>();
  public gameMessage$ = this._gameMessage.asObservable();

  private _worker: Worker;

  constructor() {

    this._worker = new Worker(new URL('./game-mechanics.worker', import.meta.url));
  
    this._worker.onmessage = ({ data }: {data: MessageResponse}) => {
      if (data.messages) {
        data.messages.forEach(m => {
          this._gameMessage.next([m]);
        })
      }
      if (data.data.primary) {
        // for right now we will only update the primary
        const idx = this._activeHeroIdx.getValue();
        const arr = [...this._heroList.getValue()];
        const exPlr = arr[idx];
        const player = data.data.primary[0];
        if (exPlr.experience < player.experience) {
          const nxtlvl = findLevelFromExperience(player.experience);
          if (player.level != nxtlvl) {
            newPlr = levelUpPlayer(newPlr, nxtlvl);
          }
        }
        arr.splice(idx, 1, newPlr);
        this._playerList.next(arr); 
      }
    };
  }

  public addCoin(coin: bigint | number): void {
    const pBank = this._bank.getValue();
    if (pBank) {
      const nBank = SysUtil.clone(pBank);
      nBank.coin += typeof coin === "number" ? BigInt(coin) : coin;
      this._bank.next(nBank);
    }
    throw new Error(`bank doesn't yet exists`);
  } 

  public updateVillan(enemy: Villan): void {
    this._villan.next(enemy);
  }

  public loadVillan(enemy: Villan): void {
    this._villan.next(enemy);
  }

  public clearEnemy(): void {
    this._villan.next(null);
  }

  public sendGameMessage(msg: string, icon?: string, header?: string): void {
    //this._gameMessage.next([...arguments] as [string, string?, string?]);
    this._gameMessage.next([msg, icon, header]);
  }
}
