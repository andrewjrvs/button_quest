import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { combineLatestWith, map } from 'rxjs/operators';
import { Player } from './models/player';
import { findLevelFromExperience, levelUpPlayer } from './player-util';

@Injectable({
  providedIn: 'root'
})
export class PlayerLibraryService {

  private _playerList = new BehaviorSubject<Player[]>([]);
  private _activePlayerIdx = new BehaviorSubject<number>(0);

  public list$ = this._playerList.asObservable();
  public activePlayer$ = this._activePlayerIdx.pipe(
    combineLatestWith(this._playerList),
    map(([idx, playerList]) => {
      if (playerList.length < 1 ||
          idx > (playerList.length - 1)) {
        return null;
      } 
      return playerList[idx];
    })
  );

  constructor() { }

  public addPlayer(player: Player): void {
    var currList = [...this._playerList.getValue()];
    currList.push(player);
    this._playerList.next(currList);
  }

  public removePlayer(idx: number): Player | null {
    var currList = [...this._playerList.getValue()];
    const rtnPlr = currList.splice(idx, 1);
    this._playerList.next(currList);
    if (currList.length > 0) {
      return rtnPlr[0];
    }
    return null;
  }

  public list(): Observable<Player[]> {
    return this._playerList
  }

  public updatePlayer(player: Player):void {
    // for now we'll just update the active item
    let newPlr = { ...player };
    const idx = this._activePlayerIdx.getValue();
    const arr = [...this._playerList.getValue()];
    const exPlr = arr[idx];
    if (exPlr.experience < player.experience) {
      const nxtlvl = findLevelFromExperience(player.experience);
      if (player.level != nxtlvl) {
        newPlr = levelUpPlayer(newPlr, nxtlvl);
      }
    }
    arr.splice(idx, 1, newPlr);
    this._playerList.next(arr);
  }

  
}
