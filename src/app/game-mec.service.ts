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
  private _gameMessage = new Subject<[string, string?, string?]>();
  public gameMessage$ = this._gameMessage.asObservable();

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

  public sendGameMessage(msg: string, icon?: string, header?: string): void {
    //this._gameMessage.next([...arguments] as [string, string?, string?]);
    this._gameMessage.next([msg, icon, header]);
  }
}
