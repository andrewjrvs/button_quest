import { Injectable } from '@angular/core';

import { Preferences } from '@capacitor/preferences';
import { combineLatest, debounceTime, filter } from 'rxjs';
import { GameMechanicsService } from './game-mechanics.service';
import { Actor, Bank, Hero } from './models';

import * as SysUtil from './utils/system-util';

// JSON.parse(v, (keys, value) => typeof value === 'string' && value.startsWith('<bigint>:') ? BigInt(value.substr(9)): value)
// v = JSON.stringify(u, (key, value) =>
//             typeof value === 'bigint'
//                 ? "<bigint>:" + value.toString()
//                 : value // return everything else unchanged
//         );
@Injectable({
  providedIn: 'root'
})
export class AppStoreService {

  constructor(private gameMec: GameMechanicsService) {
    combineLatest([gameMec.bank$, gameMec.heroList$, gameMec.heroIndex$])
      .pipe(
        filter(([_, lst]) => !!lst.length )
        , debounceTime(1000)
      )
      .subscribe(([bnk, lst, indx]) => {
        Preferences.set({
          key: 'app-data'
          , value: SysUtil.jsonStringify({
            bank: bnk, heros: lst, activeIndex: indx
          })
        })
      })
  }

  public async pullForFirstLoad(): Promise<[Bank, Hero[], number] | undefined> {
    const { value } = await Preferences.get({ key: 'app-data' });
    if (value) {
      try {
        const dta = SysUtil.jsonParse<[Bank, Actor[], number]>(value);
        if (dta) {
          return [dta[0], dta[1].map(d => Hero.create(d)), dta[2]]
        }
      } catch (ex) {
        return undefined;
      }
    }
    return undefined;
  }



}
