import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { Enemy } from './models/emeny';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class GameMecService {

  public _userEvent = new Subject<string | null>()
  public _user = new BehaviorSubject<User>({ coin: BigInt(0) });
  public user$ = this._user.asObservable();

  private _pendingEnemy = new ReplaySubject<Enemy>(1);
  public pendingEnemy$ = this._pendingEnemy.asObservable();

  constructor() { }

  public addCoin(coin: bigint | number): void {
    const nxtUser = { ...this._user.getValue() };
    const addC = typeof coin === "number" ? BigInt(coin) : coin;
    nxtUser.coin += addC;
    this._user.next(nxtUser);
  } 

  public updateEnemy(enemy: Enemy): void {
    this._pendingEnemy.next(enemy);
  }

  public loadEnemy(enemy: Enemy): void {
    this._pendingEnemy.next(enemy);
  }

  public getCoin(): bigint {
    return this._user.getValue().coin;
  }
}
