import { Injectable } from '@angular/core';

import { Preferences } from '@capacitor/preferences';
import { combineLatest, debounceTime, filter } from 'rxjs';
import { GameMecService } from './game-mec.service';
import { Player } from './models/player';
import { User } from './models/user';
import { PlayerLibraryService } from './player-library.service';

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

  constructor(private gameMec: GameMecService
    , private plrSrv: PlayerLibraryService) {
    combineLatest([gameMec.user$, plrSrv.list$, plrSrv.playerIndex$])
      .pipe(
        filter(([usr, lst, indx]) => !!usr && !!lst.length)
        , debounceTime(1000)
      )
      .subscribe(([usr, lst, indx]) => {
        console.log('setting');
        Preferences.set({
          key: 'app-data'
          , value: JSON.stringify({
            user: usr, players: lst, activeIndex: indx
          }, (_, value) => typeof value === 'bigint'
                             ? "<bigint>:" + value.toString()
                             : value)
        })
      })
  }

  public async pullForFirstLoad(): Promise<[User, Player[], number] | undefined> {
    const { value } = await Preferences.get({ key: 'app-data' });
    if (value) {
      try {
        const dta = JSON.parse(value, (key, value) => typeof value === 'string' &&
          value.startsWith('<bigint>:')
          ? BigInt(value.substring(9))
          : value);
        return [dta.user as User, dta.players as Player[], dta.activeIndex as number]
      } catch (ex) {
        return undefined;
      }
    }
    return undefined;
  }



}
