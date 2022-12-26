import { Injectable } from '@angular/core';
import { Item, ItemType, Villan } from './models';
import { EnemyType, subType } from './models/enemy-type';
import { ItemFactoryService } from './store/item-factory.service';
import * as SysUtil from './utils/system-util';


function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  const randomEnumValue = enumValues[randomIndex]
  return randomEnumValue;
}

@Injectable({
  providedIn: 'root'
})
export class VillanFactoryService {

  constructor(private itmFct: ItemFactoryService) { }

  private calcLevelHealth(lvl: number): number {
    return SysUtil.getRandomInt(lvl * 10, lvl * 50);
  }

  private calcAttack(lvl: number): number {
    return SysUtil.getNormalDistRandomInt(Math.max(lvl - 10, 1), Math.max(Math.ceil(lvl  / 3) + 2, 2), -1);
  }

  private calcDefence(lvl: number): number {
    return SysUtil.getNormalDistRandomInt(Math.max(lvl - 10, 0), Math.max(lvl - 10, 0), -1);
  }

  private calcCoin(lvl: number): bigint {
    return BigInt(SysUtil.getNormalDistRandomInt(5, lvl + 5) * SysUtil.getRandomInt(1, 15));
  }

  private hasAttachedItem(): [boolean, Item | null] {
    const hasItem = SysUtil.getNormalDistRandomInt(1, 10) > 6;
    if (!hasItem) {
      return [hasItem, null];
    }
    let itm: Item;
    const itemTypeCheck = SysUtil.getNormalDistRandomInt(1, 10, 3);
    if (itemTypeCheck < 8) {
      // itm = this.itmFct.getHealthContainer('s')
      return [false, null];
    } else {
      itm = this.itmFct.generateImproveItem();
    }
    
    return [hasItem, itm];
  }

  private hasHealthItem(lvl: number): [boolean, Item | null, number] {
    // 50% chance it's a health item...
    const hasItem = SysUtil.getNormalDistRandomInt(1, 11) >= 6;
    console.log('hasHealthItem', hasItem);

    if (!hasItem) {
      return [hasItem, null, 0];
    }
    const hlthOrdr: ('s' | 'm' | 'f')[] = ['s', 'm', 'f'];
    let baseItem = 0;
    if (lvl > 20) {
      baseItem = 1;
    }
    let attHItem = baseItem;
    let cnt = 1;
    const itemTypeCheck = SysUtil.getNormalDistRandomInt(1, 100);
    if (itemTypeCheck >= 80) {
      attHItem = hlthOrdr.length - 1;
    } else if (itemTypeCheck >= 50) {
      attHItem++;
    } else {
      cnt = Math.max(Math.floor(itemTypeCheck / 20), 1);
    }
    console.log('Has Health', lvl, attHItem, cnt);
    return [hasItem, this.itmFct.getHealthContainer(hlthOrdr[attHItem]), cnt];
  }
  private hasAttachedWeapon(): boolean {
    return SysUtil.getNormalDistRandomInt(1, 10) > 7;
  }


  public getNew(level: number): Villan {
    const et = randomEnum(EnemyType);
    const ets = subType[et][SysUtil.getRandomInt(0, subType[et].length - 1)];
    const vilLvl = level < 5 ? level : SysUtil.getRandomInt(Math.max(level - 5, 1), level + 5);
    const rtn = new Villan(
      `${ets}-${vilLvl}`
      , `${ets}-${vilLvl}`
      , et
      , ets
      , this.calcLevelHealth(vilLvl)
      , vilLvl);
    rtn.attack = this.calcAttack(vilLvl);
    rtn.defence = this.calcDefence(vilLvl);
    rtn.sack.coin = this.calcCoin(vilLvl);

    if (this.hasAttachedWeapon()) {
      const wpn = this.itmFct.generateWeapon(vilLvl);
      rtn.attached.push(wpn);
    }
    const [hasItm, itm] = this.hasAttachedItem();
    if (hasItm && itm) {
      rtn.sack.items.push(itm);
    }
    const [hasHlt, hItm, hCount] = this.hasHealthItem(vilLvl);  
    if (hasHlt && hItm) {
      for (var i = 1; i <= hCount; i++) {
        var _itm = SysUtil.clone(hItm);
        rtn.sack.items.push(_itm);
      }
    }

    return rtn;
  }
}
