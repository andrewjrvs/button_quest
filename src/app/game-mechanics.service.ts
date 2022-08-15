import { Injectable } from '@angular/core';
import { BehaviorSubject, map, ReplaySubject, Subject, combineLatestWith } from 'rxjs';
import { Actor, Bank, Hero, Item, MessageRequest, MessageRequestType, MessageResponse, Villan } from './models';
import * as SysUtil from './utils/system-util';
import * as LvlUtil from './utils/leveling-util';
import { Sack } from './models/sack';

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

  private _bank = new BehaviorSubject<Bank | undefined>(undefined);
  public bank$ = this._bank.asObservable();

  private _villan = new ReplaySubject<Villan | undefined>(1);
  public activeVillan$ = this._villan.asObservable();

  private _gameMessage = new Subject<[string, string?, string?]>();
  public gameMessage$ = this._gameMessage.asObservable();

  private _worker: Worker;

  constructor() {

    this._worker = new Worker(new URL('./game-mechanics.worker', import.meta.url));
  
    this._worker.onmessage = ({ data }: {data: MessageResponse}) => {
      if (data.messages) {
        data.messages.forEach(m => {
          if (Array.isArray(m)) {
            this._gameMessage.next([m[0], m[1]]);
          } else {
            this._gameMessage.next([m]);
          }
        })
      }
      if (data.data.primary) {
        // for right now we will only update the primary
        const idx = this._activeHeroIdx.getValue();
        const arr = [...this._heroList.getValue()];
        const exPlr = arr[idx];
        const player = data.data.primary[0];
        arr.splice(idx, 1, Hero.create(player));
        this._heroList.next(arr); 
      }
      if (data.data.secondary && data.data.secondary.length > 0) {
        this._villan.next(Villan.create(data.data.secondary[0]));
      }
      if (data.data.bank) {
        this._bank.next(data.data.bank);
      }
    };
  }

  public addCoin(coin: bigint | number): void {
    const pBank = this._bank.getValue();
    if (pBank) {
      const nBank = SysUtil.clone(pBank);
      nBank.coin += typeof coin === "number" ? BigInt(coin) : coin;
      this._bank.next(nBank);
      return;
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
    this._villan.next(undefined);
  }

  public fight(hero: Hero, villan: Villan): void {
    this._worker.postMessage(<MessageRequest>{
      type: MessageRequestType.FIGHT
      , data: {
        primary: [hero]
        , secondary: [villan]
        , bank: this._bank.getValue()
      }
    });
  }

  public setBank(bnk: Bank): void {
    this._bank.next(bnk);
  }

  /**
   * Heal the list of users that was passed in
   * @param heroList 
   * @param force 
   * @param sack if passed, use this sack as the source
   */
  public rest(heroList: Hero[], force: boolean = false, sack?: Sack): void {
    this._worker.postMessage(<MessageRequest>{
      type: MessageRequestType.REST
      , data: {
        primary: heroList
        , bank: sack || this._bank.getValue()
        , isCustomBank: !!sack
      }
    })
  }

  public addHero(hero: Hero): void {
    var currList = [...this._heroList.getValue()];
    currList.push(hero);
    this._heroList.next(currList);
  }

  public removeHero(idx: number): Hero | null {
    var currList = [...this._heroList.getValue()];
    const rtnPlr = currList.splice(idx, 1);
    this._heroList.next(currList);
    if (currList.length > 0) {
      return rtnPlr[0];
    }
    return null;
  }

  public updatePlayer(player: Hero):void {
    // for now we'll just update the active item
    let newPlr = { ...player };
    const idx = this._activeHeroIdx.getValue();
    const arr = [...this._heroList.getValue()];
    const exPlr = arr[idx];

    arr.splice(idx, 1, newPlr);
    this._heroList.next(arr);
  }

  public setActiveIndex(indx: number): void {
    this._activeHeroIdx.next(indx);
  }

  public processDeadHero(hero: Hero): void {
    this._worker.postMessage({
      type: MessageRequestType.DEATH
      , data: {
        primary: [hero]
      }
    })
  }

  public processItem(itm: Item, primary: Actor, secondary?: Actor): void {
    this._worker.postMessage({
      type: MessageRequestType.ITEM
      , data: {
        primary: [primary]
        , secondary: [secondary]
        , item: itm
      }
    })
  }

  /**
   * Process a message
   * @param msg message to send
   * @param icon icon to use
   * @param header header of the message
   */
  public sendGameMessage(msg: string, icon?: string, header?: string): void {
    //this._gameMessage.next([...arguments] as [string, string?, string?]);
    this._gameMessage.next([msg, icon, header]);
  }
}
